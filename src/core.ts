export const FACTORY = "0x2a53833cc95548cf52c7b159110e22d3a9018f32";
export const CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    apiName: "ethereum",
    rpc: "https://ethereum-rpc.publicnode.com",
    confirmations: 64,
    explorer: "https://etherscan.io",
  },
  {
    id: 56,
    name: "BNB Chain",
    apiName: "BSC",
    rpc: "https://bsc-rpc.publicnode.com",
    confirmations: 100,
    explorer: "https://bscscan.com",
  },
  {
    id: 4663,
    name: "Robinhood",
    apiName: "Robinhood",
    rpc: "https://robinhood-rpc.publicnode.com",
    confirmations: 100,
    explorer: "https://robinhoodchain.blockscout.com",
  },
];
export const ROUTERS = new Set([
  "0x02201e6f13c41506c7bb635d7543f98826229ab7",
  "0x3c6c4fc94f1493b9d76c5e4c4cdedb444d3cc0a2",
]);
export type Pool = {
  chainId: number;
  poolAddress: string;
  pair: string;
  token0: string;
  token1: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Decimals: number;
  token1Decimals: number;
  token0FiatPrice: number | null;
  token1FiatPrice: number | null;
  createdBlockNumber: number;
  createdTimestamp: number;
  poolFactoryAddress: string;
  creator?: string;
};
export type Swap = {
  chainId: number;
  txHash: string;
  logIndex: number;
  blockNumber: number;
  timestamp: number;
  poolAddress: string;
  traderAddress: string;
  senderRouter: string;
  recipient: string;
  amount0Delta: string;
  amount1Delta: string;
  volumeUsd: number | null;
  priceMode: string;
  binIdx: number;
};
export function decodePackedSwap(
  details: bigint,
  amounts: bigint,
  fees: bigint,
) {
  for (const value of [details, amounts, fees])
    if (value < 0n || value >= 1n << 256n)
      throw new Error("Packed values must be uint256");
  const mask128 = (1n << 128n) - 1n;
  return {
    posInBin: details & ((1n << 104n) - 1n),
    binIdx: Number(BigInt.asIntN(16, details >> 104n)),
    exactInput: ((details >> 120n) & 1n) === 1n,
    amount0Delta: BigInt.asIntN(128, amounts >> 128n),
    amount1Delta: BigInt.asIntN(128, amounts & mask128),
    spreadFee: fees >> 128n,
    notionalFee: fees & mask128,
  };
}
// Address allowlist prevents a token named USDC from being treated as a dollar.
const STABLES: Record<number, Set<string>> = {
  1: new Set([
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
  ]),
  56: new Set([
    "0x55d398326f99059ff775485246999027b3197955",
    "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  ]),
};
export function valueSwap(pool: Pool, amount0: bigint, amount1: bigint) {
  const amount = (v: bigint, d: number) => Number(v < 0n ? -v : v) / 10 ** d;
  for (const i of [0, 1] as const) {
    const address = i === 0 ? pool.token0 : pool.token1;
    if (STABLES[pool.chainId]?.has(address.toLowerCase()))
      return {
        volumeUsd: amount(
          i === 0 ? amount0 : amount1,
          i === 0 ? pool.token0Decimals : pool.token1Decimals,
        ),
        priceMode: "stable-unit-estimate",
      };
  }
  for (const i of [0, 1] as const) {
    const price = i === 0 ? pool.token0FiatPrice : pool.token1FiatPrice;
    if (price != null && Number.isFinite(price) && price > 0) {
      const volume =
        amount(
          i === 0 ? amount0 : amount1,
          i === 0 ? pool.token0Decimals : pool.token1Decimals,
        ) * price;
      if (Number.isFinite(volume))
        return { volumeUsd: volume, priceMode: "metadata-spot-estimate" };
    }
  }
  return { volumeUsd: null, priceMode: "unpriced" };
}
export type Wallet = {
  address: string;
  volumeUsd: number;
  swaps: number;
  transactions: number;
  pricedSwaps: number;
  avgSwapUsd: number | null;
  chains: number[];
  pools: number;
  favoritePool: string;
  lastActive: number;
  firstSeen: number;
  activeDays: number;
  directRouterPct: number;
  rank: number;
  topPercent: number;
  cohort: string;
  sharePct: number;
};
export function aggregate(
  swaps: Swap[],
  pools: Pool[],
  since: number,
  until: number,
  chainId?: number,
) {
  const poolMap = new Map(
    pools.map((p) => [`${p.chainId}:${p.poolAddress}`, p]),
  );
  const groups = new Map<string, Swap[]>();
  for (const s of swaps) {
    if (
      s.timestamp < since ||
      s.timestamp > until ||
      (chainId && s.chainId !== chainId)
    )
      continue;
    const address = s.traderAddress.toLowerCase();
    const g = groups.get(address) ?? [];
    g.push(s);
    groups.set(address, g);
  }
  const wallets: Wallet[] = [...groups]
    .map(([address, rows]) => {
      const byPool = new Map<string, number>();
      for (const s of rows) {
        const key = `${s.chainId}:${s.poolAddress}`;
        byPool.set(key, (byPool.get(key) ?? 0) + (s.volumeUsd ?? 0));
      }
      const favorite = [...byPool].sort((a, b) => b[1] - a[1])[0]?.[0];
      const volumeUsd = rows.reduce((n, s) => n + (s.volumeUsd ?? 0), 0);
      const pricedSwaps = rows.filter((s) => s.volumeUsd != null).length;
      return {
        address,
        volumeUsd,
        swaps: rows.length,
        transactions: new Set(rows.map((s) => `${s.chainId}:${s.txHash}`)).size,
        pricedSwaps,
        avgSwapUsd: pricedSwaps ? volumeUsd / pricedSwaps : null,
        chains: [...new Set(rows.map((s) => s.chainId))],
        pools: byPool.size,
        favoritePool: poolMap.get(favorite)?.pair ?? "—",
        firstSeen: Math.min(...rows.map((s) => s.timestamp)),
        lastActive: Math.max(...rows.map((s) => s.timestamp)),
        activeDays: new Set(rows.map((s) => Math.floor(s.timestamp / 86400)))
          .size,
        directRouterPct:
          (100 * rows.filter((s) => ROUTERS.has(s.senderRouter)).length) /
          rows.length,
        rank: 0,
        topPercent: 0,
        cohort: "",
        sharePct: 0,
      };
    })
    .sort(
      (a, b) => b.volumeUsd - a.volumeUsd || a.address.localeCompare(b.address),
    );
  const totalVolumeUsd = wallets.reduce((n, w) => n + w.volumeUsd, 0);
  let rank = 1;
  wallets.forEach((w, i) => {
    if (i > 0 && w.volumeUsd !== wallets[i - 1].volumeUsd) rank = i + 1;
    w.rank = rank;
    w.topPercent = (100 * rank) / wallets.length;
    w.cohort =
      w.volumeUsd > 0 && rank <= Math.max(1, Math.ceil(wallets.length / 100))
        ? "Top 1%"
        : "Rest";
    w.sharePct = totalVolumeUsd ? (100 * w.volumeUsd) / totalVolumeUsd : 0;
  });
  const selected = [...groups.values()].flat();
  const top = wallets.filter((w) => w.cohort === "Top 1%");
  const sum = (rows: Wallet[]) => rows.reduce((n, w) => n + w.volumeUsd, 0);
  return {
    wallets,
    totalWallets: wallets.length,
    active24h: wallets.filter((w) => w.lastActive >= until - 86400).length,
    active7d: wallets.filter((w) => w.lastActive >= until - 7 * 86400).length,
    totalVolumeUsd,
    swapCount: selected.length,
    transactionCount: new Set(selected.map((s) => `${s.chainId}:${s.txHash}`))
      .size,
    pricedSwaps: selected.filter((s) => s.volumeUsd != null).length,
    spotEstimatedSwaps: selected.filter(
      (s) => s.priceMode === "metadata-spot-estimate",
    ).length,
    top1Count: top.length,
    top1SharePct: totalVolumeUsd ? (100 * sum(top)) / totalVolumeUsd : 0,
    top10SharePct: totalVolumeUsd
      ? (100 * sum(wallets.slice(0, 10))) / totalVolumeUsd
      : 0,
    cutoffUsd: top.at(-1)?.volumeUsd ?? null,
    medianVolumeUsd: wallets.length
      ? (wallets[Math.floor((wallets.length - 1) / 2)].volumeUsd +
          wallets[Math.ceil((wallets.length - 1) / 2)].volumeUsd) /
        2
      : null,
    daily: [...new Set(selected.map((s) => Math.floor(s.timestamp / 86400)))]
      .sort((a, b) => a - b)
      .map((day) => {
        const rows = selected.filter(
          (s) => Math.floor(s.timestamp / 86400) === day,
        );
        return {
          day: day * 86400,
          wallets: new Set(rows.map((s) => s.traderAddress)).size,
          volumeUsd: rows.reduce((n, s) => n + (s.volumeUsd ?? 0), 0),
        };
      }),
  };
}
