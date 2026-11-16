import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "node:process";
import { spawn, spawnSync } from "node:child_process";
import { DatabaseSync, backup } from "node:sqlite";
import { gunzipSync } from "node:zlib";
import { acquireWriterLock } from "./lock";
import { isSnapshotPath, sha256, snapshotPaths, validateSnapshot } from "./snapshotValidation";

process.chdir(fileURLToPath(new URL("../", import.meta.url)));
for (const file of [".env.local", "../.env", "../.env.local"])
  if (fs.existsSync(file)) loadEnvFile(file);
const directory = "data/automation";
fs.mkdirSync(directory, { recursive: true });
const log = path.join(directory, new Date().toISOString().replaceAll(":", "-") + ".log");
const stateFile = path.join(directory, "state.json");
type State = { backupDay?: string; pending?: { commit: string; checksum: string }; lastPublishedAt?: string };
let state: State = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : {};
const redact = (s: string) => process.env.ENVIO_API_TOKEN ? s.replaceAll(process.env.ENVIO_API_TOKEN, "[redacted]") : s;
const writeLog = (s: string) => fs.appendFileSync(log, redact(s) + "\n");
function saveState() {
  fs.writeFileSync(stateFile + ".tmp", JSON.stringify(state));
  fs.renameSync(stateFile + ".tmp", stateFile);
}
function git(args: string[], accepted = [0]) {
  const result = spawnSync("git", args, { encoding: "utf8", maxBuffer: 128 * 1024 * 1024, timeout: 180_000, windowsHide: true });
  if (!accepted.includes(result.status ?? -1)) {
    writeLog(result.stderr || result.error?.message || "Git command failed");
    throw new Error(`Git ${args[0]} failed; see the run log`);
  }
  return { output: result.stdout.trim(), status: result.status };
}
const head = () => git(["rev-parse", "HEAD"]).output;
const remoteHead = () => git(["rev-parse", "refs/remotes/origin/main"]).output;
function checkWorktree() {
  if (git(["diff", "--cached", "--quiet"], [0, 1]).status !== 0)
    throw new Error("Existing staged changes: leave them untouched and retry after the user finishes");
  const paths = [
    ...git(["diff", "--name-only", "-z", "HEAD"]).output.split("\0"),
    ...git(["ls-files", "--others", "--exclude-standard", "-z"]).output.split("\0"),
  ].filter(Boolean);
  const unrelated = paths.filter(p => !isSnapshotPath(p));
  if (unrelated.length) throw new Error("Uncommitted source or unrelated files: " + unrelated.slice(0, 5).join(", "));
}
function pushAndVerify(commit: string) {
  git(["push", "origin", "main"]);
  const actual = git(["ls-remote", "origin", "refs/heads/main"]).output.split(/\s/)[0];
  if (actual !== commit) throw new Error("Remote commit verification failed; pending commit retained");
}
let activeChild: ReturnType<typeof spawn> | undefined;
async function scan() {
  writeLog("Starting incremental swaps and LP scan");
  await new Promise<void>((resolve, reject) => {
    activeChild = spawn(process.execPath, ["--env-file-if-exists=.env", "--import", "tsx", "src/cli.ts"], {
      stdio: ["ignore", "pipe", "pipe"], windowsHide: true, timeout: 25 * 60_000,
    });
    for (const stream of [activeChild.stdout!, activeChild.stderr!]) {
      let pending = "";
      stream.setEncoding("utf8");
      stream.on("data", (chunk: string) => {
        const lines = (pending + chunk).split("\n");
        pending = lines.pop()!;
        for (const line of lines) writeLog(line);
      });
      stream.on("end", () => { if (pending) writeLog(pending); });
    }
    activeChild.once("error", reject);
    activeChild.once("close", (code, signal) => {
      activeChild = undefined;
      if (code === 0) resolve();
      else reject(new Error(`Scan failed (${signal ?? code}); snapshot will not be published`));
    });
  });
}
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => { activeChild?.kill(signal); process.exit(1); });
}

let releasePublisher: (() => void) | undefined;
let releaseDatabase: (() => void) | undefined;
try {
  // The publisher lock spans scan, validation and push; the CLI has its own DB lock.
  try { releasePublisher = acquireWriterLock(directory); }
  catch (e) {
    if (String(e).includes("already running")) {
      console.log(JSON.stringify({ status: "skipped", reason: "Another publisher is running", log }));
      process.exit(0);
    }
    throw e;
  }
  if (!fs.existsSync("data/metric.sqlite")) throw new Error("Persistent SQLite database missing; do not start a new history scan");
  const disk = fs.statfsSync("data");
  if (disk.bavail * disk.bsize < 12 * 1024 ** 3) throw new Error("Less than 12 GiB free; cannot safely scan and back up");
  if (git(["branch", "--show-current"]).output !== "main") throw new Error("Expected local main branch");
  if (git(["remote", "get-url", "origin"]).output !== "https://github.com/Nerevarine22/dbmetric.git")
    throw new Error("Unexpected Git remote; refusing to publish");
  checkWorktree();
  git(["fetch", "origin", "main"]);
  if (state.pending) {
    if (remoteHead() === head() && git(["merge-base", "--is-ancestor", state.pending.commit, "HEAD"], [0, 1]).status === 0) {
      delete state.pending; saveState();
    } else {
      if (head() !== state.pending.commit) throw new Error("HEAD changed since pending push; manual review needed");
      if (git(["merge-base", "--is-ancestor", "origin/main", "HEAD"], [0, 1]).status !== 0)
        throw new Error("Remote diverged; never force-push or automatically rebase");
      const changed = git(["diff", "--name-only", "-z", "origin/main..HEAD"]).output.split("\0").filter(Boolean);
      if (!changed.length || changed.some(p => !isSnapshotPath(p))) throw new Error("Pending commit contains unrelated files");
      const committed = spawnSync("git", ["show", "HEAD:public/analytics.json"], { maxBuffer: 128 * 1024 * 1024, windowsHide: true });
      if (committed.status !== 0 || sha256(committed.stdout) !== state.pending.checksum)
        throw new Error("Pending snapshot checksum mismatch");
      pushAndVerify(head()); delete state.pending; saveState();
      writeLog("Recovered the previous verified snapshot push");
    }
  }
  const initialHead = head();
  if (initialHead !== remoteHead()) throw new Error("Local main and origin/main differ; leave branches untouched for review");
  const previous = JSON.parse(git(["show", "HEAD:public/analytics.json"]).output) as { asOf: number; coverage: { chain_id: number; to_block: number }[] };
  console.log(JSON.stringify({ status: "running", log }));
  const started = Math.floor(Date.now() / 1000);
  await scan();
  releaseDatabase = acquireWriterLock();
  const { report, files, checksum } = validateSnapshot();
  if (report.asOf < previous.asOf || report.generatedAt < started || Date.now() / 1000 - report.asOf > 4 * 3600)
    throw new Error("Snapshot regressed, was not regenerated, or is more than four hours behind");
  for (const old of previous.coverage) {
    if (!report.coverage.some(c => c.chain_id === old.chain_id && c.to_block >= old.to_block))
      throw new Error("Chain checkpoint regressed");
  }
  const checkpoint = JSON.parse(fs.readFileSync("data/checkpoints/latest.json", "utf8"));
  if (checkpoint.sha256 !== checksum || sha256(gunzipSync(fs.readFileSync(checkpoint.snapshotFile))) !== checksum)
    throw new Error("Archived snapshot and checkpoint disagree");
  const db = new DatabaseSync("data/metric.sqlite", { readOnly: true });
  try {
    const run = db.prepare("SELECT started_at,status FROM runs ORDER BY id DESC LIMIT 1").get();
    if (run?.status !== "complete" || Number(run.started_at) < started) throw new Error("Latest scan is not complete");
    for (const c of report.coverage) {
      const saved = db.prepare("SELECT to_block,status FROM coverage WHERE chain_id=?").get(c.chain_id);
      const lp = db.prepare("SELECT block_number FROM lp_valuation_heads WHERE chain_id=?").get(c.chain_id);
      if (saved?.status !== "complete" || saved.to_block !== c.to_block || lp?.block_number !== c.to_block)
        throw new Error("Database and snapshot checkpoints disagree");
    }
    const failed = db.prepare("SELECT COUNT(*) n FROM lp_pool_valuations WHERE status NOT IN ('verified','replayed') OR error IS NOT NULL").get();
    if (failed?.n !== 0) throw new Error("LP pool verification failed");
    const day = new Date().toISOString().slice(0, 10);
    if (state.backupDay !== day || !fs.existsSync(path.join(directory, "latest.sqlite"))) {
      writeLog("Creating the daily rolling SQLite backup");
      const temporary = path.join(directory, "backup.tmp.sqlite");
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
      await backup(db, temporary);
      fs.renameSync(temporary, path.join(directory, "latest.sqlite"));
      state.backupDay = day; saveState();
    }
  } finally { db.close(); }
  checkWorktree();
  git(["fetch", "origin", "main"]);
  if (head() !== initialHead || remoteHead() !== initialHead) throw new Error("Git HEAD changed during scan; leave generated files for the next run");
  git(["add", "--", ...snapshotPaths]);
  const staged = git(["diff", "--cached", "--name-only", "--no-renames", "-z"]).output.split("\0").filter(Boolean);
  if (staged.some(p => !isSnapshotPath(p))) throw new Error("Unexpected staged file; refusing to commit");
  if (!staged.length) {
    console.log(JSON.stringify({ status: "unchanged", log }));
  } else {
    const token = process.env.ENVIO_API_TOKEN;
    if (!token) throw new Error("Missing Envio token for secret check");
    if (git(["grep", "--cached", "--quiet", "-F", "-e", token, "--"], [0, 1]).status !== 1)
      throw new Error("API token found in staged content; refusing to commit");
    git(["diff", "--cached", "--check"]);
    const asOf = new Date(report.asOf * 1000).toISOString();
    git(["commit", "--quiet", "-m", `Refresh Metric snapshot (${asOf})`]);
    const commit = head();
    state.pending = { commit, checksum }; saveState();
    pushAndVerify(commit);
    delete state.pending; state.lastPublishedAt = new Date().toISOString(); saveState();
    console.log(JSON.stringify({ status: "published", asOf, commit, files,
      traders: report.scopes[0].windows.all.totalWallets,
      volume24hUsd: report.scopes[0].windows["24h"].totalVolumeUsd,
      activeLPs: report.liquidity.scopes[0].activeLPWallets, log }));
  }
} catch (error) {
  const message = redact(error instanceof Error ? error.message : String(error));
  writeLog(message);
  console.error(JSON.stringify({ status: "failed", message, log }));
  process.exitCode = 1;
} finally {
  releaseDatabase?.(); releasePublisher?.();
}
