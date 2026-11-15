import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  normalizeWallet,
  tradeLookupRow,
  type TradeLookupSource,
  type WalletPeriod,
  type WalletEntry,
  type WalletShard,
  type WalletLookupManifest,
} from "./wallets";
import type { LPWallet } from "./lp/report";
export class WalletLookupExport {
  private directory: string;
  private buffers = new Map<string, string>();
  private checksum = createHash("sha256");
  constructor(
    private publicRoot = "public",
    stageRoot = "data",
  ) {
    fs.mkdirSync(stageRoot, { recursive: true });
    this.directory = fs.mkdtempSync(path.join(stageRoot, "wallet-export-"));
  }
  private append(chain: number, address: string, kind: string, value: unknown) {
    if (normalizeWallet(address) !== address)
      throw new Error("Invalid address in wallet export");
    const key = `${chain}-${address.slice(2, 4)}`;
    const record = JSON.stringify([address, kind, value]) + "\n";
    this.checksum.update(`${chain}:` + record);
    const buffer = (this.buffers.get(key) ?? "") + record;
    this.buffers.set(key, buffer);
    if (buffer.length >= 65536) this.flush(key);
  }
  private flush(key: string) {
    const buffer = this.buffers.get(key);
    if (buffer) {
      fs.appendFileSync(path.join(this.directory, key + ".jsonl"), buffer);
      this.buffers.set(key, "");
    }
  }
  addTrading(
    chain: number,
    period: WalletPeriod,
    rows: Iterable<TradeLookupSource>,
  ) {
    for (const p of rows)
      this.append(chain, p.address, period, tradeLookupRow(p));
  }
  addLiquidity(chain: number, wallets: LPWallet[]) {
    for (const w of wallets) this.append(chain, w.address, "lp", w);
  }
  finalize(): WalletLookupManifest {
    for (const key of this.buffers.keys()) this.flush(key);
    const snapshotId = this.checksum.digest("hex").slice(0, 24);
    const manifest: WalletLookupManifest = {
      version: 1,
      snapshotId,
      files: {},
      walletCounts: {},
    };
    for (const file of fs.readdirSync(this.directory).sort()) {
      const match = /^(\d+)-([0-9a-f]{2})\.jsonl$/.exec(file);
      if (!match) continue;
      const [, chain, prefix] = match,
        wallets: Record<string, WalletEntry> = {};
      for (const line of fs
        .readFileSync(path.join(this.directory, file), "utf8")
        .trim()
        .split("\n")) {
        const [address, kind, value] = JSON.parse(line);
        const entry = wallets[address] ?? { trading: {} };
        if (kind === "lp") entry.lp = value;
        else entry.trading[kind as WalletPeriod] = value;
        wallets[address] = entry;
      }
      const shard: WalletShard = {
        version: 1,
        snapshotId,
        chainId: Number(chain),
        prefix,
        wallets,
      };
      const json = JSON.stringify(shard),
        hash = createHash("sha256").update(json).digest("hex").slice(0, 16);
      const relative = `wallets/${chain}/${prefix}-${hash}.json`,
        target = path.join(this.publicRoot, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target + ".tmp", json);
      fs.renameSync(target + ".tmp", target);
      (manifest.files[chain] ??= {})[prefix] = relative;
      manifest.walletCounts[chain] =
        (manifest.walletCounts[chain] ?? 0) + Object.keys(wallets).length;
    }
    return manifest;
  }
  dispose() {
    // Delete only files in this exporter-owned staging directory.
    for (const file of fs.readdirSync(this.directory))
      fs.unlinkSync(path.join(this.directory, file));
    fs.rmdirSync(this.directory);
  }
}
export function pruneWalletShards(
  current: WalletLookupManifest,
  previous?: WalletLookupManifest,
  publicRoot = "public",
) {
  const keep = new Set(
    Object.values(current.files).flatMap((files) => Object.values(files)),
  );
  // Prune only paths named by the previous generated manifest; user files are untouched.
  const root = path.resolve(publicRoot, "wallets") + path.sep;
  for (const files of Object.values(previous?.files ?? {}))
    for (const file of Object.values(files)) {
      const target = path.resolve(publicRoot, file);
      if (
        !keep.has(file) &&
        target.startsWith(root) &&
        /^[0-9a-f]{2}-[0-9a-f]{16}\.json$/.test(path.basename(target)) &&
        fs.existsSync(target)
      )
        fs.unlinkSync(target);
    }
}
