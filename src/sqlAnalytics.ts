import type { DatabaseSync } from "node:sqlite";
import { ROUTERS, type Wallet } from "./core";
export function sqlAnalytics(
  db: DatabaseSync,
  since: number,
  until: number,
  chainId = 0,
) {
  const where =
    "timestamp>=? AND timestamp<=?" + (chainId ? " AND chain_id=?" : "");
  const params = chainId ? [since, until, chainId] : [since, until];
  const routerSql = [...ROUTERS].map((a) => `'${a}'`).join(",");
  const rows = db
    .prepare(
      `SELECT s.trader address,SUM(COALESCE(s.volume_usd,0)) volumeUsd,COUNT(*) swaps,
    COUNT(DISTINCT CAST(s.chain_id AS TEXT)||':'||s.tx_hash) transactions,COUNT(s.volume_usd) pricedSwaps,
    AVG(s.volume_usd) avgSwapUsd,GROUP_CONCAT(DISTINCT s.chain_id) chains,
    COUNT(DISTINCT CAST(s.chain_id AS TEXT)||':'||s.pool_address) pools,MIN(s.timestamp) firstSeen,MAX(s.timestamp) lastActive,
    COUNT(DISTINCT CAST(s.timestamp/86400 AS INTEGER)) activeDays,
    100.0*SUM(CASE WHEN s.sender_router IN (${routerSql}) THEN 1 ELSE 0 END)/COUNT(*) directRouterPct,
    '—' favoritePool
    FROM swaps s INDEXED BY swaps_analytics_cover WHERE ${where}
    GROUP BY s.trader ORDER BY volumeUsd DESC,address`,
    )
    .all(...params) as unknown as (Omit<Wallet, "chains"> & {
    chains: string;
  })[];
  const totalVolumeUsd = rows.reduce((n, w) => n + w.volumeUsd, 0);
  const topSize = Math.max(1, Math.ceil(rows.length / 100));
  let rank = 1;
  const wallets: Wallet[] = rows.map((w, i) => {
    if (i > 0 && w.volumeUsd !== rows[i - 1].volumeUsd) rank = i + 1;
    return {
      ...w,
      chains: w.chains.split(",").map(Number),
      rank,
      topPercent: (100 * rank) / rows.length,
      cohort: w.volumeUsd > 0 && rank <= topSize ? "Top 1%" : "Rest",
      sharePct: totalVolumeUsd ? (100 * w.volumeUsd) / totalVolumeUsd : 0,
    };
  });
  const top = wallets.filter((w) => w.cohort === "Top 1%");
  const listed = wallets.slice(0, 1000);
  if (listed.length) {
    const favoriteRows = db
      .prepare(
        `SELECT trader,chain_id,pool_address,SUM(COALESCE(volume_usd,0)) v FROM swaps INDEXED BY swaps_analytics_cover WHERE ${where} AND trader IN (${listed.map(() => "?").join(",")}) GROUP BY trader,chain_id,pool_address ORDER BY trader,v DESC,pool_address`,
      )
      .all(...params, ...listed.map((w) => w.address));
    const poolNames = new Map(
      db
        .prepare(
          "SELECT chain_id,address,json_extract(metadata,'$.pair') pair FROM pools",
        )
        .all()
        .map((p) => [`${p.chain_id}:${p.address}`, String(p.pair)]),
    );
    const favorites = new Map<string, string>();
    for (const row of favoriteRows) {
      const address = String(row.trader);
      if (!favorites.has(address))
        favorites.set(
          address,
          poolNames.get(`${row.chain_id}:${row.pool_address}`) ?? "—",
        );
    }
    for (const wallet of listed)
      wallet.favoritePool = favorites.get(wallet.address) ?? "—";
  }
  const sum = (rows: Wallet[]) => rows.reduce((n, w) => n + w.volumeUsd, 0);
  const counts = db
    .prepare(
      `SELECT COUNT(*) swapCount,COUNT(DISTINCT CAST(chain_id AS TEXT)||':'||tx_hash) transactionCount,COUNT(volume_usd) pricedSwaps,COALESCE(SUM(price_mode='metadata-spot-estimate'),0) spotEstimatedSwaps FROM swaps WHERE ${where}`,
    )
    .get(...params) as {
    swapCount: number;
    transactionCount: number;
    pricedSwaps: number;
    spotEstimatedSwaps: number;
  };
  const daily = db
    .prepare(
      `SELECT CAST(timestamp/86400 AS INTEGER)*86400 day,COUNT(DISTINCT trader) wallets,SUM(COALESCE(volume_usd,0)) volumeUsd FROM swaps WHERE ${where} GROUP BY day ORDER BY day`,
    )
    .all(...params);
  return {
    wallets: listed,
    listedWallets: Math.min(1000, wallets.length),
    totalWallets: wallets.length,
    active24h: wallets.filter((w) => w.lastActive >= until - 86400).length,
    active7d: wallets.filter((w) => w.lastActive >= until - 604800).length,
    totalVolumeUsd,
    ...counts,
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
    daily,
  };
}
