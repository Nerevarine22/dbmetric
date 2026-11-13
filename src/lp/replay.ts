import type { DatabaseSync } from "node:sqlite";
import { toFunctionSelector } from "viem";
import { CHAINS, type Pool } from "../core";
import { rpc, hex } from "../rpc";
import {
  applyLPEvent,
  positionAmounts,
  type LPEvent,
  type Position,
  type LPConfig,
} from "./core";
import { parseLPConfig, scaledValue } from "./valuation";
import { LPReader } from "./multicall";
import { indexBinSwaps } from "./binIndexer";
export type BinBalance = {
  poolAddress: string;
  bin: number;
  amount0: bigint;
  amount1: bigint;
};
export function addBinBalance(
  balances: Map<string, BinBalance>,
  poolAddress: string,
  bin: number,
  a: bigint,
  b: bigint,
) {
  const key = poolAddress + ":" + bin;
  const prior = balances.get(key) || {
    poolAddress,
    bin,
    amount0: 0n,
    amount1: 0n,
  };
  prior.amount0 += a;
  prior.amount1 += b;
  balances.set(key, prior);
}
export function replayPositionValue(
  pool: Pool,
  positions: Position[],
  balances: BinBalance[],
  config: LPConfig,
) {
  const states = new Map(balances.map((b) => [b.bin, b]));
  const supply = new Map<number, bigint>();
  for (const p of positions)
    supply.set(p.bin, (supply.get(p.bin) || 0n) + BigInt(p.shares));
  for (const b of balances) {
    if (
      b.amount0 < 0n ||
      b.amount1 < 0n ||
      b.amount0 >= 1n << 104n ||
      b.amount1 >= 1n << 104n
    )
      throw new Error("Replayed bin balance outside uint104");
    if (!supply.get(b.bin) && (b.amount0 !== 0n || b.amount1 !== 0n))
      throw new Error("Replayed reserves exist without indexed LP shares");
  }
  return positions.map((p) => {
    const b = states.get(p.bin) || { amount0: 0n, amount1: 0n };
    const own = positionAmounts(
      BigInt(p.shares),
      supply.get(p.bin)!,
      b.amount0,
      b.amount1,
    );
    return {
      ...p,
      amount0Scaled: own.amount0Scaled.toString(),
      amount1Scaled: own.amount1Scaled.toString(),
      activeUsd: scaledValue(
        pool,
        own.amount0Scaled,
        own.amount1Scaled,
        config,
      ),
      error: null,
    };
  });
}
export async function valueLPFromEvents(
  db: DatabaseSync,
  pools: Pool[],
  chain: (typeof CHAINS)[number],
) {
  await indexBinSwaps(db, pools, chain);
  const state = db
    .prepare("SELECT * FROM lp_coverage WHERE chain_id=?")
    .get(chain.id)!;
  const head = Number(state.to_block);
  const url = process.env[`RPC_${chain.id}`] || chain.rpc;
  const before = await rpc(url, "eth_getBlockByNumber", [hex(head), false]);
  const selected = pools.filter(
    (p) => p.chainId === chain.id && p.createdBlockNumber <= head,
  );
  const balances = new Map<string, BinBalance>();
  const ledger = new Map<string, Position>();
  const eventPools = new Set<string>();
  for (const b of db
    .prepare("SELECT * FROM lp_bin_swap_totals WHERE chain_id=?")
    .iterate(chain.id))
    addBinBalance(
      balances,
      String(b.pool_address),
      Number(b.bin),
      BigInt(String(b.delta0)),
      BigInt(String(b.delta1)),
    );
  for (const row of db
    .prepare(
      "SELECT data FROM lp_events WHERE chain_id=? AND block_number<=? ORDER BY block_number,log_index",
    )
    .iterate(chain.id, head)) {
    const e = JSON.parse(String(row.data)) as LPEvent;
    applyLPEvent(ledger, e);
    eventPools.add(e.poolAddress);
    for (const b of e.bins)
      addBinBalance(
        balances,
        e.poolAddress,
        b.bin,
        BigInt(b.amount0Scaled),
        BigInt(b.amount1Scaled),
      );
  }
  const byPool = new Map<string, Position[]>();
  for (const p of ledger.values()) {
    const rows = byPool.get(p.poolAddress) || [];
    rows.push(p);
    byPool.set(p.poolAddress, rows);
  }
  const binPools = new Map<string, BinBalance[]>();
  for (const b of balances.values()) {
    const rows = binPools.get(b.poolAddress) || [];
    rows.push(b);
    binPools.set(b.poolAddress, rows);
  }
  const reader = new LPReader(url, "latest");
  await reader.check(chain.id);
  let index = 0;
  const results: {
    pool: Pool;
    positions: (Position & {
      amount0Scaled: string | null;
      amount1Scaled: string | null;
      activeUsd: number | null;
      error: string | null;
    })[];
    error: string | null;
    config?: LPConfig;
  }[] = [];
  await Promise.all(
    Array.from({ length: 12 }, async () => {
      while (index < selected.length) {
        const pool = selected[index++];
        const positions = byPool.get(pool.poolAddress) || [];
        try {
          const covered = db
            .prepare(
              "SELECT * FROM lp_bin_coverage WHERE chain_id=? AND pool_address=?",
            )
            .get(chain.id, pool.poolAddress);
          if (
            !covered ||
            Number(covered.to_block) !== head ||
            Number(covered.from_block) > pool.createdBlockNumber ||
            covered.block_hash !== before.hash
          )
            throw new Error("BinSwapped replay coverage mismatch");
          const cached = db
            .prepare(
              "SELECT * FROM lp_configs WHERE chain_id=? AND pool_address=?",
            )
            .get(chain.id, pool.poolAddress);
          const config =
            cached?.factor0 && cached?.factor1
              ? {
                  factor0: String(cached.factor0),
                  factor1: String(cached.factor1),
                }
              : eventPools.has(pool.poolAddress)
                ? parseLPConfig(
                    await reader.read(
                      pool.poolAddress,
                      toFunctionSelector("getImmutables()"),
                    ),
                    pool,
                  )
                : { factor0: "1", factor1: "1" };
          const valued = replayPositionValue(
            pool,
            positions,
            binPools.get(pool.poolAddress) || [],
            config,
          );
          results.push({
            pool,
            positions: valued,
            error: null,
            config: eventPools.has(pool.poolAddress) ? config : undefined,
          });
        } catch (e) {
          const error = String(e);
          results.push({
            pool,
            positions: positions.map((p) => ({
              ...p,
              amount0Scaled: null,
              amount1Scaled: null,
              activeUsd: null,
              error,
            })),
            error,
          });
          console.log(
            `${chain.name}: event valuation failed ${pool.poolAddress}: ${error}`,
          );
        }
      }
    }),
  );
  const after = await rpc(url, "eth_getBlockByNumber", [hex(head), false]);
  if (after.hash !== before.hash)
    throw new Error("Bin replay snapshot reorganized");
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM lp_positions WHERE chain_id=?").run(chain.id);
    db.prepare("DELETE FROM lp_pool_valuations WHERE chain_id=?").run(chain.id);
    const insert = db.prepare(
      "INSERT INTO lp_positions VALUES(?,?,?,?,?,?,?,?,?,?)",
    );
    const valuation = db.prepare(
      "INSERT INTO lp_pool_valuations VALUES(?,?,?,?,?,?)",
    );
    for (const r of results) {
      for (const p of r.positions)
        insert.run(
          chain.id,
          p.poolAddress,
          p.owner,
          p.salt,
          p.bin,
          p.shares,
          p.amount0Scaled,
          p.amount1Scaled,
          p.activeUsd,
          p.error,
        );
      valuation.run(
        chain.id,
        r.pool.poolAddress,
        head,
        Number(state.to_timestamp),
        r.error ? "error" : "replayed",
        r.error,
      );
      if (r.config)
        db.prepare("INSERT OR REPLACE INTO lp_configs VALUES(?,?,?,?,0)").run(
          chain.id,
          r.pool.poolAddress,
          r.config.factor0,
          r.config.factor1,
        );
    }
    db.prepare(
      "INSERT OR REPLACE INTO lp_valuation_heads VALUES(?,?,?,?,?)",
    ).run(
      chain.id,
      head,
      Number(state.to_timestamp),
      String(before.hash),
      Math.floor(Date.now() / 1000),
    );
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  console.log(
    `${chain.name}: event-replayed LP snapshot ${ledger.size} bin positions; ${results.filter((r) => r.error).length} failed pools`,
  );
  if (results.some((r) => r.error))
    throw new Error(
      `${chain.name}: partial LP event valuation saved; inspect pool errors before publishing rankings`,
    );
}
