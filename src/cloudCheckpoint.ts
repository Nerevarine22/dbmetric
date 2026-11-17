import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { createGzip, createGunzip } from "node:zlib";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { acquireWriterLock } from "./lock";

export const REPOSITORY = "Nerevarine22/dbmetric";
const TAG = "metric-state";
const PREFIX = "metric-checkpoint-";
const directory = "data/cloud-checkpoints";
const partSize = 512 * 1024 ** 2;
type Asset = { id: number; name: string; size: number; state: string; digest?: string; browser_download_url: string };
type Release = { id: number; upload_url: string };
type Part = { name: string; bytes: number; sha256: string };
export type Manifest = { version: 1; createdAt: string; rawBytes: number; rawSha256: string; parts: Part[] };
export function checkManifest(value: Manifest) {
  if (value.version !== 1 || !Number.isFinite(Date.parse(value.createdAt)) ||
      !Number.isSafeInteger(value.rawBytes) || value.rawBytes <= 0 || !/^[a-f0-9]{64}$/.test(value.rawSha256) ||
      !Array.isArray(value.parts) || !value.parts.length || value.parts.length > 32)
    throw new Error("Invalid cloud checkpoint manifest");
  const names = new Set<string>();
  const id = PREFIX + new Date(value.createdAt).toISOString().replaceAll(":", "-");
  for (const [index, p] of value.parts.entries()) {
    if (!/^metric-checkpoint-[\dTZ.-]+-part-\d{3}\.gz$/.test(p.name) || names.has(p.name) ||
        p.name !== `${id}-part-${String(index).padStart(3, "0")}.gz` ||
        !Number.isSafeInteger(p.bytes) || p.bytes <= 0 || p.bytes > partSize || !/^[a-f0-9]{64}$/.test(p.sha256))
      throw new Error("Invalid cloud checkpoint part");
    names.add(p.name);
  }
  return value;
}
export function githubToken() {
  const existing = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (existing) return existing;
  if (process.env.GITHUB_ACTIONS === "true") throw new Error("GITHUB_TOKEN missing");
  const result = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n", encoding: "utf8", windowsHide: true, timeout: 10000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" },
  });
  const token = result.status === 0 ? result.stdout.split(/\r?\n/).find(v => v.startsWith("password="))?.slice(9) : undefined;
  if (!token) throw new Error("Authenticated GitHub credential unavailable");
  return token;
}
export class GitHub {
  constructor(private token = githubToken()) {}
  async api(route: string, method = "GET", body?: unknown): Promise<any> {
    const response = await fetch(`https://api.github.com${route}`, {
      method, headers: { Authorization: `Bearer ${this.token}`, Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(60000),
    });
    if (response.status === 404 && method === "GET") return null;
    if (!response.ok) throw new Error(`GitHub ${method} ${route}: HTTP ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
  async release(create = false): Promise<Release> {
    const repo = await this.api(`/repos/${REPOSITORY}`);
    if (!repo || repo.private !== false) throw new Error("Cloud publisher requires the approved public repository");
    let release = await this.api(`/repos/${REPOSITORY}/releases/tags/${TAG}`);
    if (!release && create) release = await this.api(`/repos/${REPOSITORY}/releases`, "POST", {
      tag_name: TAG, target_commitish: "main", name: "Metric indexer checkpoints", prerelease: true, make_latest: "false",
      body: "Public onchain SQLite checkpoints for the Metric indexer. No credentials or environment files are included. Manifests are uploaded last; the newest complete manifest is the recovery point.",
    });
    if (!release) throw new Error("Cloud database seed missing; stop instead of rebuilding history");
    return release;
  }
  async assets(release: Release): Promise<Asset[]> {
    const result: Asset[] = [];
    for (let page = 1; ; page++) {
      const rows = await this.api(`/repos/${REPOSITORY}/releases/${release.id}/assets?per_page=100&page=${page}`) as Asset[];
      result.push(...rows); if (rows.length < 100) return result;
    }
  }
  async upload(release: Release, name: string, bytes: number, body: () => BodyInit, digest?: string) {
    const base = release.upload_url.split("{")[0];
    const url = new URL(base);
    if (url.hostname !== "uploads.github.com") throw new Error("Unexpected upload host");
    url.searchParams.set("name", name);
    for (let attempt = 0; attempt < 3; attempt++) {
      const existing = (await this.assets(release)).find(a => a.name === name);
      if (existing?.state === "uploaded" && existing.size === bytes && (!digest || !existing.digest || existing.digest === `sha256:${digest}`)) return;
      if (existing) await this.api(`/repos/${REPOSITORY}/releases/assets/${existing.id}`, "DELETE");
      try {
        const options = { method: "POST", headers: { Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github+json", "Content-Type": "application/octet-stream", "Content-Length": String(bytes) },
          body: body(), duplex: "half", signal: AbortSignal.timeout(15 * 60000) } as RequestInit;
        const response = await fetch(url, options);
        if (response.ok) { await response.json(); return; }
        if (response.status < 500 && response.status !== 429 && response.status !== 422)
          throw new Error(`Checkpoint upload HTTP ${response.status}`);
        await response.body?.cancel();
      } catch (error) {
        if (attempt === 2) throw error;
      }
      if (attempt === 2) throw new Error("Checkpoint upload failed after three attempts");
      await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
}
async function download(asset: Asset, file: string) {
  const url = new URL(asset.browser_download_url);
  if (url.hostname !== "github.com" || !url.pathname.startsWith(`/${REPOSITORY}/releases/download/${TAG}/`))
    throw new Error("Unexpected checkpoint download URL");
  const response = await fetch(url, { signal: AbortSignal.timeout(15 * 60000) });
  if (!response.ok || !response.body) throw new Error(`Checkpoint download HTTP ${response.status}`);
  await pipeline(Readable.from(response.body as unknown as AsyncIterable<Uint8Array>), fs.createWriteStream(file));
}
async function hashFile(file: string, start?: number, end?: number) {
  const hash = createHash("sha256");
  for await (const chunk of fs.createReadStream(file, { start, end })) hash.update(chunk);
  return hash.digest("hex");
}
async function readManifest(asset: Asset) {
  const file = path.join(directory, "manifest-download.json");
  await download(asset, file);
  const manifest = checkManifest(JSON.parse(fs.readFileSync(file, "utf8")));
  if (asset.name !== `${PREFIX}${new Date(manifest.createdAt).toISOString().replaceAll(":", "-")}.manifest.json`)
    throw new Error("Checkpoint manifest filename does not match its contents");
  return manifest;
}
async function assertNoSecrets(file: string, token: string) {
  const secrets = [token, process.env.ENVIO_API_TOKEN].filter((s): s is string => !!s).map(s => Buffer.from(s));
  const keep = Math.max(...secrets.map(s => s.length)) - 1;
  let tail = Buffer.alloc(0);
  for await (const data of fs.createReadStream(file)) {
    const chunk = Buffer.concat([tail, data as Buffer]);
    if (secrets.some(secret => chunk.includes(secret))) throw new Error("Credential detected in database; refusing public upload");
    tail = chunk.subarray(Math.max(0, chunk.length - keep));
  }
}
export async function restoreCheckpoint() {
  if (fs.existsSync("data/metric.sqlite")) throw new Error("Refusing to overwrite an existing database");
  const release = await new GitHub().release();
  const client = new GitHub(), assets = await client.assets(release);
  const manifests = assets.filter(a => /^metric-checkpoint-[\dTZ.-]+\.manifest\.json$/.test(a.name)).sort((a,b) => b.name.localeCompare(a.name));
  if (!manifests.length) throw new Error("No complete database checkpoint; stop instead of starting from zero");
  const manifest = await readManifest(manifests[0]);
  const archive = path.join(directory, "restore.sqlite.gz"), tmp = "data/restore.tmp.sqlite";
  fs.writeFileSync(archive, Buffer.alloc(0));
  for (const part of manifest.parts) {
    const asset = assets.find(a => a.name === part.name && a.size === part.bytes && a.state === "uploaded");
    if (!asset) throw new Error("Incomplete cloud checkpoint parts");
    const file = path.join(directory, "part.tmp");
    await download(asset, file);
    if (await hashFile(file) !== part.sha256) throw new Error("Cloud checkpoint part checksum mismatch");
    await pipeline(fs.createReadStream(file), fs.createWriteStream(archive, { flags: "a" }));
    fs.unlinkSync(file);
  }
  await pipeline(fs.createReadStream(archive), createGunzip(), fs.createWriteStream(tmp));
  if (fs.statSync(tmp).size !== manifest.rawBytes || await hashFile(tmp) !== manifest.rawSha256)
    throw new Error("Cloud database checksum mismatch");
  const db = new DatabaseSync(tmp, { readOnly: true });
  try { if (db.prepare("PRAGMA quick_check").get()?.quick_check !== "ok") throw new Error("Cloud database integrity check failed"); }
  finally { db.close(); }
  if (fs.existsSync("data/metric.sqlite")) throw new Error("Refusing to overwrite an existing database");
  fs.renameSync(tmp, "data/metric.sqlite");
  fs.unlinkSync(archive);
  console.log(JSON.stringify({ status: "restored", createdAt: manifest.createdAt, bytes: manifest.rawBytes }));
}
export async function saveCheckpoint() {
  const releaseLock = acquireWriterLock();
  try {
    if (!fs.existsSync("data/metric.sqlite")) throw new Error("No local database to checkpoint");
    const client = new GitHub(), release = await client.release(true);
    const db = new DatabaseSync("data/metric.sqlite");
    try {
      if (db.prepare("PRAGMA wal_checkpoint(TRUNCATE)").get()?.busy !== 0)
        throw new Error("Database checkpoint is busy; refusing an inconsistent backup");
      if (db.prepare("PRAGMA quick_check").get()?.quick_check !== "ok") throw new Error("Database integrity check failed");
    } finally { db.close(); }
    await assertNoSecrets("data/metric.sqlite", githubToken());
    const createdAt = new Date().toISOString(), id = PREFIX + createdAt.replaceAll(":", "-");
    const archive = path.join(directory, "checkpoint.sqlite.gz");
    console.log("Compressing the resumable onchain database");
    await pipeline(fs.createReadStream("data/metric.sqlite"), createGzip({ level: 1 }), fs.createWriteStream(archive));
    const manifest: Manifest = { version: 1, createdAt, rawBytes: fs.statSync("data/metric.sqlite").size,
      rawSha256: await hashFile("data/metric.sqlite"), parts: [] };
    const size = fs.statSync(archive).size;
    for (let start = 0, index = 0; start < size; start += partSize, index++) {
      const end = Math.min(size, start + partSize) - 1, name = `${id}-part-${String(index).padStart(3,"0")}.gz`;
      const sha256 = await hashFile(archive, start, end), bytes = end - start + 1;
      console.log(`Uploading checkpoint part ${index + 1}/${Math.ceil(size / partSize)}`);
      await client.upload(release, name, bytes, () => fs.createReadStream(archive, { start, end }) as unknown as BodyInit, sha256);
      manifest.parts.push({ name, bytes, sha256 });
    }
    checkManifest(manifest);
    const raw = Buffer.from(JSON.stringify(manifest));
    // Publishing the manifest last makes incomplete uploads invisible to restores.
    await client.upload(release, `${id}.manifest.json`, raw.length, () => raw);
    const assets = await client.assets(release);
    const manifests = assets.filter(a => /^metric-checkpoint-[\dTZ.-]+\.manifest\.json$/.test(a.name)).sort((a,b) => b.name.localeCompare(a.name));
    for (const old of manifests.slice(2)) {
      const data = await readManifest(old);
      for (const name of [...data.parts.map(p => p.name), old.name]) {
        const asset = assets.find(a => a.name === name);
        if (asset) await client.api(`/repos/${REPOSITORY}/releases/assets/${asset.id}`, "DELETE");
      }
    }
    fs.unlinkSync(archive);
    console.log(JSON.stringify({ status: "checkpoint-saved", createdAt, rawBytes: manifest.rawBytes, compressedBytes: size, parts: manifest.parts.length }));
  } finally { releaseLock(); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.mkdirSync(directory, { recursive: true });
  const command = process.argv[2];
  try {
    if (command === "restore") await restoreCheckpoint();
    else if (command === "save") await saveCheckpoint();
    else throw new Error("Use cloudCheckpoint.ts restore or save");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Cloud checkpoint failed");
    process.exitCode = 1;
  }
}
