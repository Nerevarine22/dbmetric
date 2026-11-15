import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { openDb, savePage, savePools } from "./db";
import { sqlAnalytics } from "./sqlAnalytics";
import { WalletLookupExport, pruneWalletShards } from "./walletExport";
import {
  checkedShard,
  normalizeWallet,
  rankCohort,
  rankPosition,
  readTrade,
  type WalletLookupManifest,
  type WalletShard,
} from "./wallets";
import { lpCutoffs, type LPWallet } from "./lp/report";
import { FACTORY, type Pool, type Swap } from "./core";
const address = (n: number) => "0x" + n.toString(16).padStart(40, "0");
const pool: Pool = {
  chainId: 1,
  poolAddress: address(99999),
  pair: "A/B",
  token0: address(99998),
  token1: address(99997),
  token0Symbol: "A",
  token1Symbol: "B",
  token0Decimals: 18,
  token1Decimals: 18,
  token0FiatPrice: 1,
  token1FiatPrice: 1,
  createdBlockNumber: 1,
  createdTimestamp: 1,
  poolFactoryAddress: FACTORY,
  creator: address(1),
};
function lp(owner: string, value: number | null): LPWallet {
  return {
    address: owner,
    activeUsd: value,
    knownActiveUsd: value ?? 0,
    lifetimeDepositsUsd: value,
    lifetimeWithdrawalsUsd: 0,
    knownDepositsUsd: value ?? 0,
    knownWithdrawalsUsd: 0,
    depositCount: 1,
    withdrawalCount: 0,
    lpTransactions: 1,
    activeDays: 1,
    openBinPositions: value === 0 ? 0 : 1,
    openPositions: value === 0 ? 0 : 1,
    activePools: value === 0 ? 0 : 1,
    chains: [1],
    firstSeen: 10,
    lastActive: 10,
    missingCurrentPositions: value === null ? 1 : 0,
    unpricedEvents: value === null ? 1 : 0,
    rank: null,
    cohort: "Inactive",
    sharePct: 0,
  };
}
test("wallet validation and rounded cohort labels preserve ties and missing ranks", () => {
  assert.equal(
    normalizeWallet("  " + address(1100).toUpperCase() + " "),
    address(1100),
  );
  for (const bad of [
    "",
    "vitalik.eth",
    "0x123",
    "0x" + "g".repeat(40),
    "https://example.com",
  ])
    assert.equal(normalizeWallet(bad), null);
  assert.equal(rankCohort(1, 3), "Top 1%");
  assert.equal(rankCohort(3, 100), "Top 5%");
  assert.equal(rankCohort(10, 100), "Top 10%");
  assert.equal(rankCohort(null, 100), "Unranked");
  assert.equal(rankPosition(1, 275179), "Top <0.01%");
  assert.equal(rankPosition(null, 0), null);
});
test("full lookup exports traders and LPs beyond displayed rows, preserves periods, network boundaries and valuation states", () => {
  const root = fs.mkdtempSync(path.resolve("data", "wallet-lookup-test-")),
    publicRoot = path.join(root, "public");
  const db = openDb(":memory:"),
    writer = new WalletLookupExport(publicRoot, root);
  try {
    savePools(db, [pool]);
    const swaps: Swap[] = Array.from({ length: 1202 }, (_, i) => ({
      chainId: 1,
      txHash: "0x" + i.toString(16),
      logIndex: 0,
      blockNumber: 5,
      timestamp: 1000,
      traderAddress: address(i + 1),
      senderRouter: address(999),
      recipient: address(998),
      poolAddress: pool.poolAddress,
      amount0Delta: "1",
      amount1Delta: "-1",
      volumeUsd: i === 1201 ? null : 1200 - i,
      priceMode: i === 1201 ? "unpriced" : "stable-unit-estimate",
      binIdx: 0,
    }));
    savePage(db, swaps, 1, 5, 1000);
    const stats = sqlAnalytics(db, 0, 1000, 0, (rows) =>
      writer.addTrading(0, "all", rows),
    );
    assert.equal(stats.wallets.length, 1000);
    assert.equal(stats.totalWallets, 1202);
    sqlAnalytics(db, 0, 1000, 1, (rows) => writer.addTrading(1, "24h", rows));
    const providers = Array.from({ length: 1002 }, (_, i) =>
      lp(address(1000000 + i), 1002 - i),
    );
    lpCutoffs(providers);
    providers.push(lp(address(2000000), 0), lp(address(2000001), null));
    writer.addLiquidity(0, providers);
    const manifest = writer.finalize();
    const lookup = (owner: string, chain = "0") => {
      const file = manifest.files[chain]?.[owner.slice(2, 4)];
      if (!file) return null;
      return checkedShard(
        JSON.parse(fs.readFileSync(path.join(publicRoot, file), "utf8")),
        manifest,
        chain,
        owner,
      );
    };
    const outside = lookup(address(1101))!;
    assert.equal(readTrade(outside.trading.all!).rank, 1101);
    assert.equal(readTrade(outside.trading.all!).volumeUsd, 100);
    assert.equal(outside.trading["24h"], undefined);
    assert.equal(
      readTrade(lookup(address(1101), "1")!.trading["24h"]!).rank,
      1101,
    );
    assert.equal(readTrade(lookup(address(1202))!.trading.all!).rank, null);
    assert.equal(lookup(address(1001001))!.lp!.rank, 1002);
    assert.deepEqual(lookup(address(1001001))!.trading, {});
    assert.equal(lookup(address(2000000))!.lp!.activeUsd, 0);
    assert.equal(lookup(address(2000000))!.lp!.rank, null);
    assert.equal(lookup(address(2000001))!.lp!.activeUsd, null);
    assert.equal(lookup(address(2000001))!.lp!.missingCurrentPositions, 1);
    assert.equal(lookup(address(7777777)), null);
    assert.equal(manifest.walletCounts[0], 2206);
    const file = Object.values(manifest.files[0])[0],
      data = JSON.parse(
        fs.readFileSync(path.join(publicRoot, file), "utf8"),
      ) as WalletShard;
    assert.throws(
      () =>
        checkedShard(
          { ...data, snapshotId: "old" },
          manifest,
          "0",
          Object.keys(data.wallets)[0],
        ),
      /snapshot changed/,
    );
    assert.throws(
      () => checkedShard(data, manifest, "56", Object.keys(data.wallets)[0]),
      /snapshot changed/,
    );
    const unrelated = path.join(publicRoot, "keep-me.json");
    fs.writeFileSync(unrelated, "{}");
    const next: WalletLookupManifest = {
      ...manifest,
      files: {},
      walletCounts: {},
    };
    pruneWalletShards(next, manifest, publicRoot);
    assert.equal(fs.existsSync(path.join(publicRoot, file)), false);
    assert.equal(fs.existsSync(unrelated), true);
  } finally {
    db.close();
    writer.dispose();
    assert(path.resolve(root).startsWith(path.resolve("data") + path.sep));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
