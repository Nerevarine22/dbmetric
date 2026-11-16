import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isSnapshotPath, sha256, validateSnapshot } from "./snapshotValidation";

function fixture(check: (root: string, report: any, save: () => void) => void) {
  fs.mkdirSync("data", { recursive: true });
  const root = path.resolve(fs.mkdtempSync("data/validation-test-"));
  try {
    const address = "0x" + "aa".repeat(20);
    const lp = { address, rank: 1, activeUsd: 10 };
    const trader = { address, rank: 1, volumeUsd: 10 };
    const r: any = { generatedAt: 200, asOf: 100, poolCount: 3,
      coverage: [1, 56, 4663].map(chain_id => ({ chain_id, status: "complete", error: null })),
      scopes: {}, liquidity: { coverage: [], scopes: {} },
      walletLookup: { version: 1, snapshotId: "fixture", files: {}, walletCounts: {} } };
    r.liquidity.coverage = r.coverage;
    for (const chain of [0, 1, 56, 4663]) {
      r.scopes[chain] = { allTimeComplete: true, windows: Object.fromEntries(["all", "24h", "7d"].map(p => [p, {
        totalWallets: 1, totalVolumeUsd: 10, windowComplete: true, wallets: [{ ...trader }],
      }])) };
      r.liquidity.scopes[chain] = { historyComplete: true, rankingComplete: true,
        failedPools: 0, unpricedOrUnverifiedWallets: 0, totalLPWallets: 1, valuedActiveLPWallets: 1, wallets: [lp] };
      const raw = Buffer.from(JSON.stringify({ version: 1, snapshotId: "fixture", chainId: chain, prefix: "aa",
        wallets: { [address]: { trading: Object.fromEntries(["all", "24h", "7d"].map(p => [p, [1, 10, 1, 1, 1, 1, 0, 90, 100, 1, 10]])), lp } } }));
      const file = `wallets/${chain}/aa-${sha256(raw).slice(0, 16)}.json`;
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), raw);
      r.walletLookup.files[chain] = { aa: file }; r.walletLookup.walletCounts[chain] = 1;
    }
    const save = () => {
      const raw = Buffer.from(JSON.stringify(r));
      fs.writeFileSync(path.join(root, "analytics.json"), raw);
      fs.writeFileSync(path.join(root, "snapshot-version.json"), JSON.stringify({ generatedAt: r.generatedAt,
        asOf: r.asOf, snapshotId: r.walletLookup.snapshotId, sha256: sha256(raw) }));
    };
    save(); check(root, r, save);
  } finally {
    assert(root.startsWith(path.resolve("data") + path.sep));
    fs.rmSync(root, { recursive: true, force: true });
  }
}
test("complete full-population snapshot passes", () => fixture(root => {
  assert.equal(validateSnapshot(root).files, 4);
}));
test("partial chain and LP snapshots cannot be published", () => fixture((root, r, save) => {
  r.coverage[0].status = "partial"; save();
  assert.throws(() => validateSnapshot(root), /Incomplete chain/);
  r.coverage[0].status = "complete";
  r.liquidity.scopes[0].rankingComplete = false; save();
  assert.throws(() => validateSnapshot(root), /Incomplete LP/);
}));
test("modified wallet shards fail their content checksum", () => fixture((root, r) => {
  fs.appendFileSync(path.join(root, r.walletLookup.files[0].aa), " ");
  assert.throws(() => validateSnapshot(root), /checksum/);
}));
test("missing population and incorrect listed ranks are rejected", () => fixture((root, r, save) => {
  r.scopes[0].windows.all.totalWallets = 2; save();
  assert.throws(() => validateSnapshot(root));
  r.scopes[0].windows.all.totalWallets = 1;
  r.scopes[0].windows.all.wallets[0].rank = 2; save();
  assert.throws(() => validateSnapshot(root));
}));
test("manifest traversal and unrelated Git files are rejected", () => fixture((root, r, save) => {
  r.walletLookup.files[0].aa = "../.env"; save();
  assert.throws(() => validateSnapshot(root), /Unsafe/);
  for (const p of [".env", "data/metric.sqlite", "src/app/page.tsx", "public/wallets/../.env", "public/wallets/0/x.json"])
    assert.equal(isSnapshotPath(p), false);
  assert.equal(isSnapshotPath("public/snapshot-version.json"), true);
}));
