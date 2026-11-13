import type { DatabaseSync } from "node:sqlite";
import {
  parseAbi,
  encodeFunctionData,
  decodeFunctionResult,
  toFunctionSelector,
  type Hex,
} from "viem";
import { CHAINS, FACTORY, type Pool } from "../core";
import { rpc, hex } from "../rpc";
import {
  applyLPEvent,
  binSlot,
  positionSlot,
  decodeBin,
  positionAmounts,
  type LPEvent,
  type Position,
  type LPConfig,
} from "./core";
import { LPReader } from "./multicall";
const ABI = parseAbi([
  "function extsload(bytes32[] slots) view returns(bytes32[])",
]);
const ARCHIVE: Record<number, string> = {
  1: "https://eth.drpc.org",
  56: "https://bsc-rpc.publicnode.com",
  4663: "https://robinhood.drpc.org",
};
const ZERO_ONE = ("0x" + "0".repeat(63) + "1") as Hex;
type ValuedPosition = Position & {
  amount0Scaled: string | null;
  amount1Scaled: string | null;
  activeUsd: number | null;
  error: string | null;
};
export function parseLPConfig(raw: string, pool: Pool): LPConfig {
  if (!/^0x[0-9a-f]+$/i.test(raw) || raw.length < 322)
    throw new Error("Invalid pool immutables");
  const word = (i: number) => raw.slice(2 + i * 64, 66 + i * 64);
  const address = (i: number) => "0x" + word(i).slice(-40).toLowerCase();
  if (
    address(0) !== FACTORY ||
    address(1) !== pool.token0 ||
    address(2) !== pool.token1
  )
    throw new Error("Pool immutable identity mismatch");
  const a = BigInt("0x" + word(3)),
    b = BigInt("0x" + word(4)),
    decimals = Math.max(18, pool.token0Decimals, pool.token1Decimals);
  if (
    a !== 10n ** BigInt(decimals - pool.token0Decimals) ||
    b !== 10n ** BigInt(decimals - pool.token1Decimals)
  )
    throw new Error("Pool scale differs from token metadata");
  return { factor0: a.toString(), factor1: b.toString() };
}
export function scaledValue(
  pool: Pool,
  a: bigint,
  b: bigint,
  config: LPConfig,
) {
  let value = 0;
  for (const i of [0, 1] as const) {
    const amount = i === 0 ? a : b;
    if (amount === 0n) continue;
    const price = i === 0 ? pool.token0FiatPrice : pool.token1FiatPrice;
    if (price == null || !Number.isFinite(price) || price <= 0) return null;
    value +=
      (Number(amount) /
        Number(i === 0 ? config.factor0 : config.factor1) /
        10 ** (i === 0 ? pool.token0Decimals : pool.token1Decimals)) *
      price;
  }
  return Number.isFinite(value) ? value : null;
}
export function reconcilePool(
  pool: Pool,
  positions: Position[],
  words: Hex[],
  config: LPConfig,
): ValuedPosition[] {
  const bins = [...new Set(positions.map((p) => p.bin))].sort((a, b) => a - b);
  if (words.length !== 1 + 2 * bins.length + positions.length)
    throw new Error("LP storage response length mismatch");
  const total = BigInt(words[0]),
    mask = (1n << 128n) - 1n;
  let sum0 = 0n,
    sum1 = 0n;
  const states = new Map<number, { a: bigint; b: bigint; supply: bigint }>();
  for (let i = 0; i < bins.length; i++) {
    const b = decodeBin(words[1 + i]);
    sum0 += b.amount0Scaled;
    sum1 += b.amount1Scaled;
    const supply = BigInt(words[1 + bins.length + i]);
    const owned = positions
      .filter((p) => p.bin === bins[i])
      .reduce((n, p) => n + BigInt(p.shares), 0n);
    if (owned !== supply)
      throw new Error(
        `Bin ${bins[i]} share supply does not match indexed owners`,
      );
    states.set(bins[i], { a: b.amount0Scaled, b: b.amount1Scaled, supply });
  }
  if (sum0 !== (total & mask) || sum1 !== total >> 128n)
    throw new Error("Indexed bins do not reconcile with pool slot1 totals");
  return positions.map((p, i) => {
    const actual = BigInt(words[1 + 2 * bins.length + i]);
    if (actual !== BigInt(p.shares))
      throw new Error("Position shares disagree with indexed history");
    const s = states.get(p.bin)!;
    const owned = positionAmounts(actual, s.supply, s.a, s.b);
    return {
      ...p,
      amount0Scaled: owned.amount0Scaled.toString(),
      amount1Scaled: owned.amount1Scaled.toString(),
      activeUsd: scaledValue(
        pool,
        owned.amount0Scaled,
        owned.amount1Scaled,
        config,
      ),
      error: null,
    };
  });
}
export async function valueLPChain(
  db: DatabaseSync,
  pools: Pool[],
  chain: (typeof CHAINS)[number],
) {
  const coverage = db
    .prepare("SELECT * FROM lp_coverage WHERE chain_id=?")
    .get(chain.id);
  if (
    !coverage ||
    coverage.status !== "complete" ||
    Number(coverage.from_block) > Number(coverage.genesis_block)
  )
    throw new Error("LP history is not complete");
  const head = Number(coverage.to_block),
    timestamp = Number(coverage.to_timestamp);
  const url =
    process.env[`LP_RPC_${chain.id}`] ||
    process.env[`RPC_${chain.id}`] ||
    ARCHIVE[chain.id];
  const reader = new LPReader(url, hex(head) as Hex);
  await reader.check(chain.id);
  const before = await rpc(
    process.env[`RPC_${chain.id}`] || chain.rpc,
    "eth_getBlockByNumber",
    [hex(head), false],
  );
  const previousHead = db
    .prepare("SELECT * FROM lp_valuation_heads WHERE chain_id=?")
    .get(chain.id);
  const ledger = new Map<string, Position>();
  const eventPools = new Set<string>();
  const lastEvents = new Map<string, number>();
  for (const row of db
    .prepare(
      "SELECT data FROM lp_events WHERE chain_id=? AND block_number<=? ORDER BY block_number,log_index",
    )
    .iterate(chain.id, head)) {
    const e = JSON.parse(String(row.data)) as LPEvent;
    applyLPEvent(ledger, e);
    eventPools.add(e.poolAddress);
    lastEvents.set(e.poolAddress, e.blockNumber);
  }
  const byPool = new Map<string, Position[]>();
  for (const p of ledger.values()) {
    const list = byPool.get(p.poolAddress) || [];
    list.push(p);
    byPool.set(p.poolAddress, list);
  }
  const selected = pools.filter(
    (p) => p.chainId === chain.id && p.createdBlockNumber <= head,
  );
  const results: {
    pool: Pool;
    positions: ValuedPosition[];
    status: string;
    error: string | null;
    config?: LPConfig;
    empty: boolean;
  }[] = [];
  let index = 0;
  async function read(pool: Pool, data: Hex) {
    return reader.read(pool.poolAddress, data);
  }
  await Promise.all(
    Array.from({ length: 12 }, async () => {
      while (index < selected.length) {
        const pool = selected[index++];
        const positions = byPool.get(pool.poolAddress) || [];
        const cached = db
          .prepare(
            "SELECT * FROM lp_configs WHERE chain_id=? AND pool_address=?",
          )
          .get(chain.id, pool.poolAddress);
        try {
          const cachedConfig =
            cached?.factor0 && cached?.factor1
              ? {
                  factor0: String(cached.factor0),
                  factor1: String(cached.factor1),
                }
              : undefined;
          const previousPool = db
            .prepare(
              "SELECT status,block_number FROM lp_pool_valuations WHERE chain_id=? AND pool_address=?",
            )
            .get(chain.id, pool.poolAddress);
          if (
            previousHead?.block_hash === before.hash &&
            previousPool?.status === "verified" &&
            Number(previousPool.block_number) === head &&
            cachedConfig &&
            positions.length
          ) {
            const previous = db
              .prepare(
                "SELECT * FROM lp_positions WHERE chain_id=? AND pool_address=?",
              )
              .all(chain.id, pool.poolAddress);
            const byKey = new Map(
              previous.map((p) => [`${p.owner}:${p.salt}:${p.bin}`, p]),
            );
            if (
              previous.length === positions.length &&
              positions.every(
                (p) =>
                  byKey.get(`${p.owner}:${p.salt}:${p.bin}`)?.shares ===
                  p.shares,
              )
            ) {
              const valued = positions.map((p) => {
                const row = byKey.get(`${p.owner}:${p.salt}:${p.bin}`)!;
                return {
                  ...p,
                  amount0Scaled: String(row.amount0_scaled),
                  amount1Scaled: String(row.amount1_scaled),
                  activeUsd: scaledValue(
                    pool,
                    BigInt(String(row.amount0_scaled)),
                    BigInt(String(row.amount1_scaled)),
                    cachedConfig,
                  ),
                  error: null,
                };
              });
              results.push({
                pool,
                positions: valued,
                status: "verified",
                error: null,
                config: cachedConfig,
                empty: false,
              });
              continue;
            }
          }
          if (
            !positions.length &&
            cached &&
            Number(cached.empty_verified) >=
              (lastEvents.get(pool.poolAddress) || 0) &&
            Number(cached.empty_verified) > 0
          ) {
            results.push({
              pool,
              positions: [],
              status: "verified",
              error: null,
              config: cachedConfig,
              empty: true,
            });
            continue;
          }
          const config =
            cachedConfig ??
            (eventPools.has(pool.poolAddress)
              ? parseLPConfig(
                  await read(pool, toFunctionSelector("getImmutables()")),
                  pool,
                )
              : {
                  factor0: (
                    10n **
                    BigInt(
                      Math.max(18, pool.token0Decimals, pool.token1Decimals) -
                        pool.token0Decimals,
                    )
                  ).toString(),
                  factor1: (
                    10n **
                    BigInt(
                      Math.max(18, pool.token0Decimals, pool.token1Decimals) -
                        pool.token1Decimals,
                    )
                  ).toString(),
                });
          const bins = [...new Set(positions.map((p) => p.bin))].sort(
            (a, b) => a - b,
          );
          const slots = [
            ZERO_ONE,
            ...bins.map((b) => binSlot(b, 4)),
            ...bins.map((b) => binSlot(b, 5)),
            ...positions.map(positionSlot),
          ];
          const words: Hex[] = [];
          for (let offset = 0; offset < slots.length; offset += 400) {
            const raw = await read(
              pool,
              encodeFunctionData({
                abi: ABI,
                functionName: "extsload",
                args: [slots.slice(offset, offset + 400)],
              }),
            );
            const batch = decodeFunctionResult({
              abi: ABI,
              functionName: "extsload",
              data: raw,
            });
            if (batch.length !== Math.min(400, slots.length - offset))
              throw new Error("Truncated pool storage response");
            words.push(...batch);
          }
          const valued = reconcilePool(pool, positions, words, config);
          results.push({
            pool,
            positions: valued,
            status: "verified",
            error: null,
            config: eventPools.has(pool.poolAddress) ? config : undefined,
            empty: positions.length === 0,
          });
        } catch (e) {
          const error = String(e).replaceAll(
            process.env.ENVIO_API_TOKEN || "__none__",
            "[redacted]",
          );
          results.push({
            pool,
            positions: positions.map((p) => ({
              ...p,
              amount0Scaled: null,
              amount1Scaled: null,
              activeUsd: null,
              error,
            })),
            status: "error",
            error,
            empty: false,
          });
          console.log(
            `${chain.name}: LP valuation failed ${pool.poolAddress}: ${error}`,
          );
        }
        if (results.length % 50 === 0)
          console.log(
            `${chain.name}: valued ${results.length}/${selected.length} pools`,
          );
      }
    }),
  );
  const after = await rpc(
    process.env[`RPC_${chain.id}`] || chain.rpc,
    "eth_getBlockByNumber",
    [hex(head), false],
  );
  if (before.hash !== after.hash)
    throw new Error(
      "LP block reorganized during valuation; snapshot discarded",
    );
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM lp_positions WHERE chain_id=?").run(chain.id);
    db.prepare("DELETE FROM lp_pool_valuations WHERE chain_id=?").run(chain.id);
    const pos = db.prepare(
        "INSERT INTO lp_positions VALUES(?,?,?,?,?,?,?,?,?,?)",
      ),
      poolRow = db.prepare(
        "INSERT INTO lp_pool_valuations VALUES(?,?,?,?,?,?)",
      );
    for (const result of results) {
      for (const p of result.positions)
        pos.run(
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
      poolRow.run(
        chain.id,
        result.pool.poolAddress,
        head,
        timestamp,
        result.status,
        result.error,
      );
      if (result.status === "verified")
        db.prepare("INSERT OR REPLACE INTO lp_configs VALUES(?,?,?,?,?)").run(
          chain.id,
          result.pool.poolAddress,
          result.config?.factor0 ?? null,
          result.config?.factor1 ?? null,
          result.empty ? head : 0,
        );
    }
    db.prepare(
      "INSERT OR REPLACE INTO lp_valuation_heads VALUES(?,?,?,?,?)",
    ).run(
      chain.id,
      head,
      timestamp,
      String(before.hash),
      Math.floor(Date.now() / 1000),
    );
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  console.log(
    `${chain.name}: LP snapshot ${ledger.size} bin positions; ${results.filter((r) => r.status === "error").length} failed pools`,
  );
  if (results.some((r) => r.status === "error"))
    throw new Error(
      `${chain.name}: partial LP storage valuation saved; inspect pool errors before publishing rankings`,
    );
}
