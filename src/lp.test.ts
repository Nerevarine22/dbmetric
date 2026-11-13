import test from "node:test";
import assert from "node:assert/strict";
import {
  parseAbi,
  encodeEventTopics,
  encodeAbiParameters,
  parseAbiParameters,
  type Hex,
} from "viem";
import {
  decodeLPLog,
  applyLPEvent,
  nativeAmount,
  valueLPEvent,
  positionAmounts,
  type LPEvent,
  type Position,
} from "./lp/core";
import { reconcilePool, scaledValue, parseLPConfig } from "./lp/valuation";
import { decodeBinSwap } from "./lp/binIndexer";
import { addBinBalance, replayPositionValue } from "./lp/replay";
import { lpCutoffs, buildLPReport, type LPWallet } from "./lp/report";
import { openDb, savePools } from "./db";
import { saveLPPage } from "./lp/db";
import { FACTORY, type Pool } from "./core";
const address = (n: number) => ("0x" + n.toString(16).padStart(40, "0")) as Hex;
const pool: Pool = {
  chainId: 1,
  poolAddress: address(10),
  pair: "TOKEN/USDC",
  token0: address(11),
  token1: address(12),
  token0Symbol: "TOKEN",
  token1Symbol: "USDC",
  token0Decimals: 18,
  token1Decimals: 6,
  token0FiatPrice: 2,
  token1FiatPrice: 1,
  createdBlockNumber: 1,
  createdTimestamp: 1,
  poolFactoryAddress: FACTORY,
};
const event = (props: Partial<LPEvent> = {}): LPEvent => ({
  chainId: 1,
  poolAddress: pool.poolAddress,
  txHash: "0x01",
  logIndex: 1,
  blockNumber: 10,
  timestamp: 1000,
  owner: address(1),
  salt: "0",
  action: "ADD",
  bins: [
    { bin: -1, shares: "100", amount0Scaled: "1000", amount1Scaled: "2000" },
  ],
  amount0Scaled: "1000",
  amount1Scaled: "2000",
  ...props,
});
const word = (n: bigint) =>
  ("0x" + BigInt.asUintN(256, n).toString(16).padStart(64, "0")) as Hex;
test("LP decoder supports indexed and legacy non-indexed uint80 salts", () => {
  for (const indexed of [true, false]) {
    const abi = parseAbi([
      `event LiquidityAdded(address indexed provider,uint80 ${indexed ? "indexed " : ""}salt,int256[] binIdxs,(int256 delta0Scaled,int256 delta1Scaled)[] deltas,uint256[] shares)`,
    ]);
    const salt = (1n << 79n) + 7n;
    const topics = encodeEventTopics({
      abi,
      eventName: "LiquidityAdded",
      args: { provider: address(1), ...(indexed ? { salt } : {}) },
    });
    const payload = indexed
      ? encodeAbiParameters(
          parseAbiParameters("int256[],(int256,int256)[],uint256[]"),
          [[-1n], [[2n, 3n]], [123n]],
        )
      : encodeAbiParameters(
          parseAbiParameters("uint80,int256[],(int256,int256)[],uint256[]"),
          [salt, [-1n], [[2n, 3n]], [123n]],
        );
    const e = decodeLPLog(
      {
        address: pool.poolAddress,
        data: payload,
        topics: topics as Hex[],
        transactionHash: "0x01",
        logIndex: 3,
        blockNumber: 10,
      },
      1,
      1000,
    );
    assert.equal(e.salt, salt.toString());
    assert.equal(e.owner, address(1));
    assert.equal(e.bins[0].bin, -1);
    assert.equal(e.bins[0].shares, "123");
  }
});
test("share replay separates salt positions, handles partial exits and rejects missing history", () => {
  const ledger = new Map<string, Position>();
  applyLPEvent(ledger, event());
  applyLPEvent(ledger, event({ salt: "1" }));
  applyLPEvent(
    ledger,
    event({
      action: "REMOVE",
      bins: [
        { bin: -1, shares: "40", amount0Scaled: "-400", amount1Scaled: "-800" },
      ],
    }),
  );
  assert.deepEqual(
    [...ledger.values()].map((p) => p.shares),
    ["60", "100"],
  );
  assert.throws(
    () => applyLPEvent(new Map(), event({ action: "REMOVE" })),
    /Negative LP shares/,
  );
});
test("deposit values normalize both token legs and round aggregated native flows once", () => {
  assert.equal(nativeAmount(2n, 10n, true), 1n);
  assert.equal(nativeAmount(-2n, 10n, false), 0n);
  const e = event({
    amount0Scaled: (2n * 10n ** 18n).toString(),
    amount1Scaled: (3n * 10n ** 18n).toString(),
  });
  assert.equal(
    valueLPEvent(e, pool, { factor0: "1", factor1: "1000000000000" }),
    7,
  );
  assert.equal(
    valueLPEvent(
      e,
      { ...pool, token1FiatPrice: null },
      { factor0: "1", factor1: "1000000000000" },
    ),
    null,
  );
});
test("pinned bin reconciliation verifies supply, owner shares and pool totals", () => {
  const p: Position = {
    chainId: 1,
    poolAddress: pool.poolAddress,
    owner: address(1),
    salt: "0",
    bin: -1,
    shares: "25",
  };
  const other = { ...p, owner: address(2), shares: "75" };
  const a = 1000n,
    b = 3000n;
  const words = [
    word(a | (b << 128n)),
    word(a | (b << 104n)),
    word(100n),
    word(25n),
    word(75n),
  ];
  const out = reconcilePool(pool, [p, other], words, {
    factor0: "1",
    factor1: "1000000000000",
  });
  assert.equal(out[0].amount0Scaled, "250");
  assert.equal(out[0].amount1Scaled, "750");
  assert.throws(
    () =>
      reconcilePool(pool, [p, other], [word(1n), ...words.slice(1)], {
        factor0: "1",
        factor1: "1",
      }),
    /slot1/,
  );
  assert.throws(
    () =>
      reconcilePool(pool, [p], words.slice(0, 4), {
        factor0: "1",
        factor1: "1",
      }),
    /share supply/,
  );
  assert.equal(positionAmounts(100n, 100n, 1000n, 3000n).amount1Scaled, 3000n);
});
test("BinSwapped reserve replay preserves signed deltas including retained LP fees", () => {
  const packed = (BigInt.asUintN(128, -100n) << 128n) | 120n;
  const data =
    "0x" + word(-1n).slice(2) + word(packed).slice(2) + word(5n).slice(2);
  const d = decodeBinSwap(data);
  assert.deepEqual(d, { bin: -1, delta0: -100n, delta1: 120n });
  const balances = new Map();
  addBinBalance(balances, pool.poolAddress, -1, 1000n, 0n);
  addBinBalance(balances, pool.poolAddress, d.bin, d.delta0, d.delta1);
  const positions = [
    {
      chainId: 1,
      poolAddress: pool.poolAddress,
      owner: address(1),
      salt: "0",
      bin: -1,
      shares: "100",
    },
  ];
  const values = replayPositionValue(pool, positions, [...balances.values()], {
    factor0: "1",
    factor1: "1000000000000",
  });
  assert.equal(values[0].amount0Scaled, "900");
  assert.equal(values[0].amount1Scaled, "120");
  assert.throws(
    () =>
      replayPositionValue(
        pool,
        positions,
        [{ poolAddress: pool.poolAddress, bin: -1, amount0: -1n, amount1: 0n }],
        { factor0: "1", factor1: "1" },
      ),
    /uint104/,
  );
});
test("immutable scale validation checks factory and token identity", () => {
  const raw =
    "0x" +
    [FACTORY, pool.token0, pool.token1]
      .map((a) => a.slice(2).padStart(64, "0"))
      .join("") +
    word(1n).slice(2) +
    word(10n ** 12n).slice(2);
  assert.deepEqual(parseLPConfig(raw, pool), {
    factor0: "1",
    factor1: "1000000000000",
  });
  assert.throws(
    () => parseLPConfig(raw, { ...pool, token0: address(99) }),
    /identity/,
  );
  assert.equal(
    scaledValue(pool, 0n, 0n, { factor0: "1", factor1: "1000000000000" }),
    0,
  );
});
test("LP ranks use active capital and include cutoff ties, excluding unpriced portfolios", () => {
  const rows = [100, 100, 1, null].map(
    (v, i) =>
      ({
        address: address(i + 1),
        activeUsd: v,
        lifetimeDepositsUsd: 1000000 - i,
      }) as LPWallet,
  );
  const result = lpCutoffs(rows);
  assert.equal(result.ranked.length, 3);
  assert.equal(result.thresholds[0].wallets, 2);
  assert.equal(result.thresholds[0].cutoffUsd, 100);
  assert.equal(result.ranked[0].rank, 1);
  assert.equal(result.ranked[1].rank, 1);
});
test("LP writes are idempotent and trader comparison joins LP owners rather than funders", () => {
  const db = openDb(":memory:");
  savePools(db, [pool]);
  const e = event();
  saveLPPage(db, [e], 1, 10, 1000);
  saveLPPage(db, [e], 1, 10, 1000);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM lp_events").get()?.n, 1);
  db.prepare("INSERT INTO lp_coverage VALUES(?,?,?,?,?,?,?,?,?)").run(
    1,
    1,
    1,
    10,
    1000,
    1,
    JSON.stringify([pool.poolAddress]),
    "complete",
    null,
  );
  db.prepare("INSERT INTO lp_valuation_heads VALUES(?,?,?,?,?)").run(
    1,
    10,
    1000,
    "0x01",
    1000,
  );
  db.prepare("INSERT INTO lp_configs VALUES(?,?,?,?,?)").run(
    1,
    pool.poolAddress,
    "1",
    "1000000000000",
    0,
  );
  db.prepare("INSERT INTO lp_positions VALUES(?,?,?,?,?,?,?,?,?,?)").run(
    1,
    pool.poolAddress,
    e.owner,
    "0",
    -1,
    "100",
    (10n * 10n ** 18n).toString(),
    (30n * 10n ** 18n).toString(),
    50,
    null,
  );
  db.prepare("INSERT INTO lp_pool_valuations VALUES(?,?,?,?,?,?)").run(
    1,
    pool.poolAddress,
    10,
    1000,
    "verified",
    null,
  );
  const report = buildLPReport(db, [pool], {});
  const scope = report.scopes[1] as any;
  assert.equal(scope.totalLPWallets, 1);
  assert.equal(scope.knownActiveLiquidityUsd, 50);
  assert.equal(scope.wallets[0].address, e.owner);
  assert.equal(scope.historyComplete, true);
  const funder = address(99);
  const insertSwap = db.prepare(
    "INSERT INTO swaps(chain_id,tx_hash,log_index,timestamp,trader,data,volume_usd) VALUES(1,?,0,900,?,char(123,125),?)",
  );
  insertSwap.run("0x11", e.owner, 1000);
  insertSwap.run("0x12", funder, 5000);
  const comparison = buildLPReport(db, [pool], {
    1: {
      until: 1000,
      windows: {
        all: {
          totalWallets: 2,
          wallets: [{ address: e.owner }, { address: funder }],
          cohorts: [
            { percent: 1, cutoffUsd: 5000, wallets: 1 },
            { percent: 10, cutoffUsd: 1000, wallets: 2 },
          ],
        },
      },
    },
  }).scopes[1] as any;
  assert.equal(comparison.traderCohorts[0].lpEver, 0);
  assert.equal(comparison.traderCohorts[1].lpEver, 1);
  assert.equal(comparison.traderCohorts[1].medianActiveUsdAmongValuedLPs, 50);
  assert.equal(comparison.traderCohorts[1].medianActiveUsdAcrossAllTraders, 25);
  assert.equal(
    comparison.traderCohorts[1].medianLifetimeDepositsUsdAcrossAllTraders,
    scope.wallets[0].lifetimeDepositsUsd / 2,
  );
  assert.equal(comparison.traderWallets[funder], null);
  assert.equal(comparison.traderWallets[e.owner].activeUsd, 50);
  db.prepare("UPDATE lp_pool_valuations SET block_number=9").run();
  const stale = buildLPReport(db, [pool], {}).scopes[1] as any;
  assert.equal(stale.rankingComplete, false);
  assert.equal(stale.failedPools, 1);
  assert.equal(stale.unpricedOrUnverifiedWallets, 1);
  assert.equal(stale.wallets.length, 0);
  db.close();
});
