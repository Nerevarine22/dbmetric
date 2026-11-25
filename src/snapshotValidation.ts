import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import type { Wallet } from "./core";
import type { LPScope } from "./app/liquidity";
import type { WalletLookupManifest, WalletPeriod, WalletShard } from "./wallets";

type Coverage = { chain_id: number; status: string; error: string | null; to_block: number; to_timestamp: number };
export type Snapshot = {
  generatedAt: number; asOf: number; poolCount: number;
  coverage: Coverage[];
  scopes: Record<string, { allTimeComplete: boolean; windows: Record<WalletPeriod, {
    totalWallets: number; totalVolumeUsd: number; windowComplete: boolean; wallets: Wallet[];
  }> }>;
  liquidity: { coverage: Coverage[]; valuationHeads: { chain_id: number; block_number: number }[]; scopes: Record<string, LPScope> };
  walletLookup: WalletLookupManifest;
};
export const snapshotPaths = ["ANALYSIS.md", "public/analytics.json", "public/snapshot-version.json", "public/wallets"];
export function isSnapshotPath(file: string) {
  return snapshotPaths.slice(0, 3).includes(file) || /^public\/wallets\/(0|1|56|4663)\/[a-f0-9]{2}-[a-f0-9]{16}\.json$/.test(file);
}
export const sha256 = (data: Uint8Array) => createHash("sha256").update(data).digest("hex");

export function validateSnapshot(root = "public") {
  const raw = fs.readFileSync(path.join(root, "analytics.json"));
  const r = JSON.parse(raw.toString()) as Snapshot;
  assert(Number.isFinite(r.asOf) && r.asOf > 0 && r.generatedAt >= r.asOf, "Invalid snapshot timestamps");
  for (const coverage of [r.coverage, r.liquidity.coverage]) {
    assert.deepEqual(coverage.map(c => c.chain_id).sort((a, b) => a - b), [1, 56, 4663]);
    assert(coverage.every(c => c.status === "complete" && !c.error), "Incomplete chain coverage");
  }
  const manifest = r.walletLookup;
  assert.equal(manifest.version, 1);
  let files = 0;
  for (const chain of ["0", "1", "56", "4663"]) {
    const scope = r.scopes[chain], lp = r.liquidity.scopes[chain];
    assert(scope.allTimeComplete, "Incomplete trading history");
    const quality = JSON.stringify({ chain, historyComplete: lp.historyComplete, rankingComplete: lp.rankingComplete,
      valuationComplete: lp.valuationComplete, failedPools: lp.failedPools,
      excluded: lp.unpricedOrUnverifiedWallets, unpriced: lp.unpricedActiveLPWallets, unverified: lp.unverifiedActiveLPWallets });
    assert(lp.historyComplete && !lp.failedPools, `Incomplete LP history or pool verification: ${quality}`);
    if (lp.valuationComplete === undefined) {
      // Previously published snapshots have no separate verification/pricing counts.
      assert(lp.rankingComplete && !lp.unpricedOrUnverifiedWallets, `Incomplete LP rankings: ${quality}`);
    } else {
      assert(lp.valuationComplete && lp.unverifiedActiveLPWallets === 0, `Incomplete LP position verification: ${quality}`);
      assert(Number.isSafeInteger(lp.unpricedActiveLPWallets) && lp.unpricedActiveLPWallets! >= 0 &&
        lp.unpricedOrUnverifiedWallets === lp.unpricedActiveLPWallets &&
        lp.rankingComplete === (lp.unpricedActiveLPWallets === 0), `Inconsistent LP pricing disclosure: ${quality}`);
    }
    const counts = { all: 0, "24h": 0, "7d": 0 };
    let owners = 0, providers = 0, rankedLPs = 0, excludedLPs = 0;
    const listed = Object.fromEntries(Object.entries(scope.windows).map(([p, w]) => {
      assert(w.windowComplete && Number.isFinite(w.totalVolumeUsd) && w.totalVolumeUsd >= 0);
      return [p, new Map(w.wallets.map(v => [v.address, v]))];
    }));
    const listedLP = new Map(lp.wallets.map(w => [w.address, w]));
    for (const [prefix, file] of Object.entries(manifest.files[chain])) {
      assert(isSnapshotPath("public/" + file), "Unsafe wallet shard path");
      assert(file.startsWith(`wallets/${chain}/${prefix}-`), "Incorrect shard prefix");
      const data = fs.readFileSync(path.join(root, file));
      assert(file.endsWith("-" + sha256(data).slice(0, 16) + ".json"), "Shard checksum mismatch");
      const shard = JSON.parse(data.toString()) as WalletShard;
      assert.equal(shard.version, 1); assert.equal(shard.snapshotId, manifest.snapshotId);
      assert.equal(String(shard.chainId), chain); assert.equal(shard.prefix, prefix);
      files++;
      for (const [address, entry] of Object.entries(shard.wallets)) {
        assert(/^0x[a-f0-9]{40}$/.test(address) && address.slice(2, 4) === prefix);
        owners++;
        for (const [period, row] of Object.entries(entry.trading)) {
          assert(period === "all" || period === "24h" || period === "7d");
          assert.equal(row.length, 11);
          assert(Number.isFinite(row[1]) && row[1] >= 0);
          counts[period]++;
          const top = listed[period].get(address);
          if (top) {
            assert.equal(row[0], top.volumeUsd > 0 ? top.rank : null);
            assert.equal(row[1], top.volumeUsd);
            listed[period].delete(address);
          }
        }
        if (entry.lp) {
          providers++;
          if (entry.lp.rank !== null) {
            assert(entry.lp.activeUsd !== null && Number.isFinite(entry.lp.activeUsd) && entry.lp.activeUsd > 0,
              "Unpriced LP portfolio cannot receive a USD rank");
            rankedLPs++;
          }
          if (entry.lp.activeUsd === null) {
            assert(entry.lp.rank === null && entry.lp.missingCurrentPositions > 0, "Undisclosed unpriced LP profile");
            excludedLPs++;
          }
          const top = listedLP.get(address);
          if (top) {
            assert.equal(entry.lp.rank, top.rank); assert.equal(entry.lp.activeUsd, top.activeUsd);
            listedLP.delete(address);
          }
        }
      }
    }
    assert.equal(owners, manifest.walletCounts[chain]);
    assert.equal(providers, lp.totalLPWallets); assert.equal(rankedLPs, lp.valuedActiveLPWallets);
    assert.equal(excludedLPs, lp.unpricedOrUnverifiedWallets, "LP exclusion count differs from wallet profiles");
    assert.equal(listedLP.size, 0);
    for (const period of ["all", "24h", "7d"] as const) {
      assert.equal(counts[period], scope.windows[period].totalWallets);
      assert.equal(listed[period].size, 0);
    }
  }
  const version = JSON.parse(fs.readFileSync(path.join(root, "snapshot-version.json"), "utf8"));
  assert.equal(version.generatedAt, r.generatedAt); assert.equal(version.asOf, r.asOf);
  assert.equal(version.sha256, sha256(raw)); assert.equal(version.snapshotId, manifest.snapshotId);
  return { report: r, files, checksum: sha256(raw) };
}
