import type { LPWallet } from "./lp/report";
export type WalletPeriod = "all" | "24h" | "7d";
// Compact rows keep the static full-population lookup small. Positions are versioned.
export type TradeLookupRow = [
  rank: number | null,
  volumeUsd: number,
  swaps: number,
  transactions: number,
  activeDays: number,
  pools: number,
  poolsCreated: number | null,
  firstSeen: number,
  lastActive: number,
  pricedSwaps: number,
  volume24hUsd: number,
];
export type TradeLookupSource = {
  address: string;
  rank: number;
  volumeUsd: number;
  swaps: number;
  transactions: number;
  activeDays: number;
  pools: number;
  poolsCreated: number | null;
  firstSeen: number;
  lastActive: number;
  pricedSwaps: number;
  volume24hUsd: number;
};
export type WalletEntry = {
  trading: Partial<Record<WalletPeriod, TradeLookupRow>>;
  lp?: LPWallet;
};
export type WalletLookupManifest = {
  version: 1;
  snapshotId: string;
  files: Record<string, Record<string, string>>;
  walletCounts: Record<string, number>;
};
export type WalletShard = {
  version: 1;
  snapshotId: string;
  chainId: number;
  prefix: string;
  wallets: Record<string, WalletEntry>;
};
export function normalizeWallet(value: string) {
  const address = value.trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(address) ? address : null;
}
export function tradeLookupRow(p: TradeLookupSource): TradeLookupRow {
  return [
    p.volumeUsd > 0 ? p.rank : null,
    p.volumeUsd,
    p.swaps,
    p.transactions,
    p.activeDays,
    p.pools,
    p.poolsCreated,
    p.firstSeen,
    p.lastActive,
    p.pricedSwaps,
    p.volume24hUsd,
  ];
}
export function readTrade(row: TradeLookupRow) {
  const [
    rank,
    volumeUsd,
    swaps,
    transactions,
    activeDays,
    pools,
    poolsCreated,
    firstSeen,
    lastActive,
    pricedSwaps,
    volume24hUsd,
  ] = row;
  return {
    rank,
    volumeUsd,
    swaps,
    transactions,
    activeDays,
    pools,
    poolsCreated,
    firstSeen,
    lastActive,
    pricedSwaps,
    volume24hUsd,
  };
}
export function rankCohort(rank: number | null, population: number) {
  if (rank === null || population <= 0) return "Unranked";
  for (const percent of [1, 5, 10])
    if (rank <= Math.ceil((population * percent) / 100))
      return `Top ${percent}%`;
  return "Outside Top 10%";
}
export function rankPosition(rank: number | null, population: number) {
  if (rank === null || population <= 0) return null;
  const percent = (100 * rank) / population;
  return percent < 0.01
    ? "Top <0.01%"
    : `Top ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(percent)}%`;
}
export function checkedShard(
  data: WalletShard,
  manifest: WalletLookupManifest,
  chainId: string,
  address: string,
) {
  if (
    data.version !== 1 ||
    data.snapshotId !== manifest.snapshotId ||
    String(data.chainId) !== chainId ||
    data.prefix !== address.slice(2, 4) ||
    !data.wallets
  )
    throw new Error(
      "The wallet snapshot changed. Refresh the snapshot and try again.",
    );
  return data.wallets[address] ?? null;
}
