import test from "node:test";
import assert from "node:assert/strict";
import {
  aggregate,
  decodePackedSwap,
  valueSwap,
  type Pool,
  type Swap,
} from "./core";
import { openDb, savePage, savePools } from "./db";
import { sqlAnalytics } from "./sqlAnalytics";
import { decodeLog } from "./indexer";
import { archiveSnapshot } from "./snapshots";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
const pool: Pool = {
  chainId: 1,
  poolAddress: "0x" + "a".repeat(40),
  pair: "WETH/USDC",
  token0: "0x" + "b".repeat(40),
  token1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  token0Symbol: "WETH",
  token1Symbol: "USDC",
  token0Decimals: 18,
  token1Decimals: 6,
  token0FiatPrice: 2000,
  token1FiatPrice: 1,
  createdBlockNumber: 1,
  createdTimestamp: 1,
  poolFactoryAddress: "0x" + "c".repeat(40),
};
const swap = (props: Partial<Swap> = {}): Swap => ({
  chainId: 1,
  txHash: "0x01",
  logIndex: 0,
  blockNumber: 5,
  timestamp: 1000000,
  poolAddress: pool.poolAddress,
  traderAddress: "0x" + "1".repeat(40),
  senderRouter: "0x02201e6f13c41506c7bb635d7543f98826229ab7",
  recipient: "0x" + "2".repeat(40),
  amount0Delta: "1000000000000000000",
  amount1Delta: "-2000000000",
  volumeUsd: 2000,
  priceMode: "stable-unit-estimate",
  binIdx: -1,
  ...props,
});
test("packed swap preserves signed boundaries, flags and both fee legs", () => {
  for (const bin of [-32768, -1, 0, 32767])
    for (const a of [-(1n << 127n), -1n, 0n, (1n << 127n) - 1n]) {
      const details =
        (BigInt.asUintN(16, BigInt(bin)) << 104n) | (1n << 120n) | 123n;
      const amounts =
        (BigInt.asUintN(128, a) << 128n) | BigInt.asUintN(128, -19n);
      const d = decodePackedSwap(details, amounts, (42n << 128n) | 13n);
      assert.equal(d.binIdx, bin);
      assert.equal(d.amount0Delta, a);
      assert.equal(d.amount1Delta, -19n);
      assert.equal(d.posInBin, 123n);
      assert.equal(d.exactInput, true);
      assert.equal(d.spreadFee, 42n);
      assert.equal(d.notionalFee, 13n);
    }
  assert.throws(() => decodePackedSwap(-1n, 0n, 0n));
  assert.throws(() => decodePackedSwap(1n << 256n, 0n, 0n));
});
test("USD counts one leg, prefers allowlisted stable units and retains missing price", () => {
  assert.deepEqual(valueSwap(pool, 1n * 10n ** 18n, -1999n * 10n ** 6n), {
    volumeUsd: 1999,
    priceMode: "stable-unit-estimate",
  });
  const unknown = {
    ...pool,
    token1: "0x" + "d".repeat(40),
    token0FiatPrice: null,
    token1FiatPrice: null,
  };
  assert.equal(valueSwap(unknown, 1n, 1n).volumeUsd, null);
  assert.equal(
    valueSwap({ ...unknown, token1FiatPrice: 2 }, 1n, 10n ** 6n).volumeUsd,
    2,
  );
});
test("user attribution comes from transaction sender, separately from event router", () => {
  const word = (v: bigint) =>
    BigInt.asUintN(256, v).toString(16).padStart(64, "0");
  const from = "0x" + "3".repeat(40),
    router = "0x" + "4".repeat(40);
  const s = decodeLog(
    {
      address: pool.poolAddress,
      data:
        "0x" +
        word(0n) +
        word((1n << 128n) | BigInt.asUintN(128, -1n)) +
        word(0n),
      topics: [
        "0x00",
        "0x" + router.slice(2).padStart(64, "0"),
        "0x" + "5".repeat(64),
      ],
      transactionHash: "0x01",
      logIndex: 1,
      blockNumber: 5,
    },
    pool,
    from,
    1000000,
  );
  assert.equal(s.traderAddress, from);
  assert.equal(s.senderRouter, router);
});
test("SQL and reference agree on cross-chain users, activity, unpriced swaps and transactions", () => {
  const swaps = [
    swap(),
    swap({ logIndex: 1 }),
    swap({ chainId: 56, logIndex: 0, txHash: "0x02", timestamp: 999000 }),
    swap({
      traderAddress: "0x" + "5".repeat(40),
      txHash: "0x03",
      timestamp: 800000,
      volumeUsd: 10,
    }),
    swap({
      traderAddress: "0x" + "6".repeat(40),
      txHash: "0x04",
      volumeUsd: null,
      priceMode: "unpriced",
    }),
  ];
  const pools = [pool, { ...pool, chainId: 56 }];
  const expected = aggregate(swaps, pools, 0, 1000000);
  const db = openDb(":memory:");
  savePools(db, pools);
  savePage(db, swaps, 1, 5, 1000000);
  savePage(db, swaps, 1, 5, 1000000);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM swaps").get()?.n, 5);
  const actual = sqlAnalytics(db, 0, 1000000);
  for (const key of [
    "totalWallets",
    "active24h",
    "active7d",
    "totalVolumeUsd",
    "swapCount",
    "transactionCount",
    "pricedSwaps",
    "top1Count",
    "top1SharePct",
    "top10SharePct",
    "cutoffUsd",
    "medianVolumeUsd",
  ] as const)
    assert.equal(actual[key], expected[key], key);
  assert.equal(actual.totalWallets, 3);
  assert.equal(actual.active24h, 2);
  assert.equal(actual.wallets[0].transactions, 2);
  assert.equal(actual.wallets[0].swaps, 3);
  assert.equal(actual.wallets[0].volumeUsd, 6000);
  assert.equal(sqlAnalytics(db, 0, 1000000, 56).totalWallets, 1);
  assert.equal(sqlAnalytics(db, 0, 1000000, 4663).totalWallets, 0);
  db.close();
});
test("cohort includes ties at cutoff and ranks are deterministic", () => {
  const swaps = Array.from({ length: 100 }, (_, i) =>
    swap({
      traderAddress: "0x" + i.toString(16).padStart(40, "0"),
      txHash: "0x" + i,
      volumeUsd: i < 2 ? 100 : 1,
    }),
  );
  const s = aggregate(swaps, [pool], 0, 1000000);
  assert.equal(s.top1Count, 2);
  assert.equal(s.wallets[0].rank, 1);
  assert.equal(s.wallets[1].rank, 1);
  assert.equal(s.wallets[2].rank, 3);
  const db = openDb(":memory:");
  savePools(db, [pool]);
  savePage(db, swaps, 1, 5, 1000000);
  const actual = sqlAnalytics(db, 0, 1000000);
  assert.equal(actual.top1Count, 2);
  assert.equal(actual.wallets[1].rank, 1);
  assert.equal(actual.wallets[2].rank, 3);
  db.close();
});
test("public row limit does not truncate population metrics", () => {
  const db = openDb(":memory:");
  savePools(db, [pool]);
  const rows = Array.from({ length: 1100 }, (_, i) =>
    swap({
      traderAddress: "0x" + i.toString(16).padStart(40, "0"),
      txHash: "0x" + i,
      volumeUsd: 1100 - i,
    }),
  );
  savePage(db, rows, 1, 5, 1000000);
  const s = sqlAnalytics(db, 0, 1000000);
  assert.equal(s.wallets.length, 1000);
  assert.equal(s.totalWallets, 1100);
  assert.equal(s.top1Count, 11);
  assert.equal(s.cutoffUsd, 1090);
  assert.equal(s.medianVolumeUsd, 550.5);
  assert.equal(s.totalVolumeUsd, 605550);
  db.close();
});
test("combined cohorts use one volume-ranked population, UTC days, unique transactions and cutoff-scoped creators", () => {
  const db = openDb(":memory:");
  const owner = (i: number) => "0x" + i.toString(16).padStart(40, "0");
  savePools(db, [
    { ...pool, creator: owner(1) },
    { ...pool, poolAddress: owner(101), creator: owner(1) },
    {
      ...pool,
      poolAddress: owner(102),
      creator: owner(1),
      createdTimestamp: 1000001,
    },
    { ...pool, chainId: 56, creator: owner(1) },
  ]);
  const rows = [
    swap({
      traderAddress: owner(1),
      txHash: "0xa",
      timestamp: 1000,
      volumeUsd: 500,
    }),
    swap({
      traderAddress: owner(1),
      txHash: "0xb",
      logIndex: 0,
      volumeUsd: 200,
    }),
    swap({
      traderAddress: owner(1),
      txHash: "0xb",
      logIndex: 1,
      volumeUsd: 300,
    }),
    swap({
      traderAddress: owner(2),
      txHash: "0xc",
      timestamp: 990000,
      volumeUsd: 1000,
    }),
    ...Array.from({ length: 98 }, (_, i) =>
      swap({
        traderAddress: owner(i + 3),
        txHash: "0x" + (i + 10),
        volumeUsd: 1,
      }),
    ),
  ];
  savePage(db, rows, 1, 5, 1000000);
  const s = sqlAnalytics(db, 0, 1000000, 1),
    top = s.cohorts[0];
  assert.equal(top.wallets, 2);
  assert.equal(top.cutoffUsd, 1000);
  assert.equal(top.totalVolumeUsd, 2000);
  assert.equal(top.volume24hUsd, 1500);
  assert.equal(top.medianVolumeUsd, 1000);
  assert.equal(top.medianVolume24hUsd, 750);
  assert.equal(top.medianTransactions, 1.5);
  assert.equal(top.medianActiveDays, 1.5);
  assert.equal(top.medianPoolsCreated, 1);
  assert.equal(top.creatorCoverageComplete, true);
  assert.equal(s.cohorts[1].wallets, 100); // Ties at the Top 5% boundary are retained.
  savePools(db, [pool]); // Unknown creator metadata must not become a zero-count estimate.
  assert.equal(
    sqlAnalytics(db, 0, 1000000, 1).cohorts[0].medianPoolsCreated,
    null,
  );
  db.close();
});
test("archived snapshot decompresses exactly and its checkpoint checksum matches", () => {
  const db = openDb(":memory:");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "metric-snapshot-"));
  try {
    const report = {
      generatedAt: 1794580000,
      coverage: [{ chain_id: 1, to_block: 42 }],
      marker: "real snapshot",
    };
    const result = archiveSnapshot(db, report, directory);
    const json = gunzipSync(fs.readFileSync(result.file)).toString("utf8");
    assert.deepEqual(JSON.parse(json), report);
    assert.equal(
      createHash("sha256").update(json).digest("hex"),
      result.sha256,
    );
    const checkpoint = JSON.parse(
      fs.readFileSync(
        path.join(directory, "checkpoints", "latest.json"),
        "utf8",
      ),
    );
    assert.deepEqual(checkpoint.coverage, report.coverage);
    assert.equal(checkpoint.sha256, result.sha256);
  } finally {
    db.close();
    assert.equal(
      path.dirname(path.resolve(directory)),
      path.resolve(os.tmpdir()),
    );
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
test("discovering an older pool rewinds the cursor instead of skipping its history", () => {
  const db = openDb(":memory:");
  savePools(db, [pool]);
  db.prepare("INSERT INTO coverage VALUES(?,?,?,?,?,?,?,?)").run(
    1,
    1,
    1,
    100,
    1000000,
    1,
    "complete",
    null,
  );
  savePools(db, [
    { ...pool, poolAddress: "0x" + "f".repeat(40), createdBlockNumber: 50 },
  ]);
  assert.equal(
    db.prepare("SELECT to_block FROM coverage WHERE chain_id=1").get()
      ?.to_block,
    49,
  );
  assert.equal(
    db.prepare("SELECT status FROM coverage WHERE chain_id=1").get()?.status,
    "indexing",
  );
  db.close();
});
