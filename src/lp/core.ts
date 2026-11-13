import {
  decodeEventLog,
  parseAbi,
  toEventSelector,
  encodeAbiParameters,
  keccak256,
  parseAbiParameters,
  type Hex,
} from "viem";
import type { Pool } from "../core";
export const LP_SIGNATURES = [
  "LiquidityAdded(address,uint80,int256[],(int256,int256)[],uint256[])",
  "LiquidityRemoved(address,uint80,int256[],(int256,int256)[],uint256[])",
];
export const LP_TOPICS = LP_SIGNATURES.map((s) => toEventSelector(s));
const eventAbi = (indexed: boolean) =>
  parseAbi([
    `event LiquidityAdded(address indexed provider,uint80 ${indexed ? "indexed " : ""}salt,int256[] binIdxs,(int256 delta0Scaled,int256 delta1Scaled)[] deltas,uint256[] shares)`,
    `event LiquidityRemoved(address indexed provider,uint80 ${indexed ? "indexed " : ""}salt,int256[] binIdxs,(int256 delta0Scaled,int256 delta1Scaled)[] deltas,uint256[] shares)`,
  ]);
export type LPBinDelta = {
  bin: number;
  shares: string;
  amount0Scaled: string;
  amount1Scaled: string;
};
export type LPEvent = {
  chainId: number;
  poolAddress: string;
  txHash: string;
  logIndex: number;
  blockNumber: number;
  timestamp: number;
  owner: string;
  salt: string;
  action: "ADD" | "REMOVE";
  bins: LPBinDelta[];
  amount0Scaled: string;
  amount1Scaled: string;
};
export type Position = {
  chainId: number;
  poolAddress: string;
  owner: string;
  salt: string;
  bin: number;
  shares: string;
};
export type LPConfig = { factor0: string; factor1: string };
export function decodeLPLog(
  log: {
    address: string;
    data: string;
    topics: (string | null | undefined)[];
    transactionHash: string;
    logIndex: number;
    blockNumber: number;
  },
  chainId: number,
  timestamp: number,
): LPEvent {
  const topics = log.topics.filter((t): t is Hex => !!t) as [Hex, ...Hex[]];
  if (topics.length !== 2 && topics.length !== 3)
    throw new Error("Unexpected LP topic layout");
  const d = decodeEventLog({
    abi: eventAbi(topics.length === 3),
    data: log.data as Hex,
    topics,
    strict: true,
  });
  const a = d.args;
  if (
    a.binIdxs.length !== a.shares.length ||
    a.binIdxs.length !== a.deltas.length
  )
    throw new Error("LP array length mismatch");
  const action = d.eventName === "LiquidityAdded" ? "ADD" : "REMOVE";
  let total0 = 0n,
    total1 = 0n;
  const bins = a.binIdxs.map((b, i) => {
    if (b < -32768n || b > 32767n) throw new Error("LP bin outside int16");
    const x = a.deltas[i];
    if (
      (action === "ADD" && (x.delta0Scaled < 0n || x.delta1Scaled < 0n)) ||
      (action === "REMOVE" && (x.delta0Scaled > 0n || x.delta1Scaled > 0n))
    )
      throw new Error("Invalid LP balance delta sign");
    total0 += x.delta0Scaled;
    total1 += x.delta1Scaled;
    return {
      bin: Number(b),
      shares: a.shares[i].toString(),
      amount0Scaled: x.delta0Scaled.toString(),
      amount1Scaled: x.delta1Scaled.toString(),
    };
  });
  return {
    chainId,
    poolAddress: log.address.toLowerCase(),
    txHash: log.transactionHash.toLowerCase(),
    logIndex: log.logIndex,
    blockNumber: log.blockNumber,
    timestamp,
    owner: a.provider.toLowerCase(),
    salt: a.salt.toString(),
    action,
    bins,
    amount0Scaled: total0.toString(),
    amount1Scaled: total1.toString(),
  };
}
export function positionKey(p: Position) {
  return [p.chainId, p.poolAddress, p.owner, p.salt, p.bin].join(":");
}
export function applyLPEvent(ledger: Map<string, Position>, e: LPEvent) {
  for (const row of e.bins) {
    const p = {
      chainId: e.chainId,
      poolAddress: e.poolAddress,
      owner: e.owner,
      salt: e.salt,
      bin: row.bin,
      shares: "0",
    };
    const key = positionKey(p);
    const shares =
      BigInt(ledger.get(key)?.shares ?? "0") +
      (e.action === "ADD" ? 1n : -1n) * BigInt(row.shares);
    if (shares < 0n)
      throw new Error(`Negative LP shares: ${key}; history is incomplete`);
    if (shares === 0n) ledger.delete(key);
    else ledger.set(key, { ...p, shares: shares.toString() });
  }
}
export function nativeAmount(scaled: bigint, factor: bigint, roundUp: boolean) {
  if (factor <= 0n) throw new Error("Invalid scale multiplier");
  const n = scaled < 0n ? -scaled : scaled;
  return roundUp ? (n + factor - 1n) / factor : n / factor;
}
export function valueTokens(pool: Pool, amount0: bigint, amount1: bigint) {
  let total = 0;
  for (const i of [0, 1] as const) {
    const amount = i === 0 ? amount0 : amount1;
    if (amount === 0n) continue;
    const price = i === 0 ? pool.token0FiatPrice : pool.token1FiatPrice;
    const decimals = i === 0 ? pool.token0Decimals : pool.token1Decimals;
    if (price == null || !Number.isFinite(price) || price <= 0) return null;
    total += (Number(amount) / 10 ** decimals) * price;
  }
  return Number.isFinite(total) ? total : null;
}
export function valueLPEvent(e: LPEvent, pool: Pool, config: LPConfig) {
  return valueTokens(
    pool,
    nativeAmount(
      BigInt(e.amount0Scaled),
      BigInt(config.factor0),
      e.action === "ADD",
    ),
    nativeAmount(
      BigInt(e.amount1Scaled),
      BigInt(config.factor1),
      e.action === "ADD",
    ),
  );
}
export function binSlot(bin: number, slot: 4 | 5) {
  return keccak256(
    encodeAbiParameters(parseAbiParameters("int256,uint256"), [
      BigInt(bin),
      BigInt(slot),
    ]),
  );
}
export function positionSlot(p: Position) {
  const key = keccak256(
    encodeAbiParameters(parseAbiParameters("address,uint80,int16"), [
      p.owner as Hex,
      BigInt(p.salt),
      p.bin,
    ]),
  );
  return keccak256(
    encodeAbiParameters(parseAbiParameters("bytes32,uint256"), [key, 6n]),
  );
}
export function decodeBin(word: Hex) {
  const n = BigInt(word),
    mask = (1n << 104n) - 1n;
  return { amount0Scaled: n & mask, amount1Scaled: (n >> 104n) & mask };
}
export function positionAmounts(
  shares: bigint,
  total: bigint,
  balance0: bigint,
  balance1: bigint,
) {
  if (shares < 0n || total < shares || total <= 0n)
    throw new Error("Invalid bin share supply");
  return {
    amount0Scaled: (balance0 * shares) / total,
    amount1Scaled: (balance1 * shares) / total,
  };
}
