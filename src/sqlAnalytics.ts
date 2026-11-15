import type { DatabaseSync } from "node:sqlite";
import { ROUTERS, type Wallet } from "./core";
import type { TraderCohort } from "./cohorts";
import type { TradeLookupSource } from "./wallets";
export function sqlAnalytics(
  db: DatabaseSync,
  since: number,
  until: number,
  chainId = 0,
  exportProfiles?: (rows: Iterable<TradeLookupSource>) => void,
) {
  const started = Date.now();
  console.log(`Aggregating ${chainId || "all chains"}: ${since}..${until}`);
  const where =
    "timestamp>=? AND timestamp<=?" + (chainId ? " AND chain_id=?" : "");
  const params = chainId ? [since, until, chainId] : [since, until];
  const routers = [...ROUTERS].map((a) => `'${a}'`).join(",");
  db.exec("DROP TABLE IF EXISTS temp.metric_profiles");
  // Keep population summaries in SQLite; only the displayed top 1,000 rows enter JS memory.
  db.prepare(
    `CREATE TEMP TABLE metric_profiles AS SELECT trader address,
    SUM(COALESCE(volume_usd,0)) volumeUsd,COUNT(*) swaps,
    SUM(CASE WHEN timestamp>=${until - 86400} THEN COALESCE(volume_usd,0) ELSE 0 END) volume24hUsd,
    COUNT(DISTINCT CAST(chain_id AS TEXT)||':'||tx_hash) transactions,
    COUNT(volume_usd) pricedSwaps,AVG(volume_usd) avgSwapUsd,
    GROUP_CONCAT(DISTINCT chain_id) chains,
    COUNT(DISTINCT CAST(chain_id AS TEXT)||':'||pool_address) pools,
    MIN(timestamp) firstSeen,MAX(timestamp) lastActive,
    COUNT(DISTINCT CAST(timestamp/86400 AS INTEGER)) activeDays,
    100.0*SUM(CASE WHEN sender_router IN (${routers}) THEN 1 ELSE 0 END)/COUNT(*) directRouterPct,
    SUM(price_mode='metadata-spot-estimate') spotEstimatedSwaps
    FROM swaps INDEXED BY swaps_analytics_cover WHERE ${where} GROUP BY trader`,
  ).run(...params);
  db.exec(
    "CREATE INDEX temp.metric_profiles_volume ON metric_profiles(volumeUsd DESC,address)",
  );
  // Creator counts come from the same canonical registry, restricted to the scope cutoff.
  db.exec("DROP TABLE IF EXISTS temp.metric_creators");
  const creatorWhere = `CAST(json_extract(metadata,'$.createdTimestamp') AS INTEGER)<=?${chainId ? " AND chain_id=?" : ""}`;
  const creatorParams = chainId ? [until, chainId] : [until];
  const missingCreators = Number(
    db
      .prepare(
        `SELECT COUNT(*) n FROM pools WHERE ${creatorWhere} AND (json_extract(metadata,'$.creator') IS NULL OR length(json_extract(metadata,'$.creator'))<>42)`,
      )
      .get(...creatorParams)!.n,
  );
  db.prepare(
    `CREATE TEMP TABLE metric_creators AS SELECT lower(json_extract(metadata,'$.creator')) address,COUNT(*) n FROM pools WHERE ${creatorWhere} GROUP BY lower(json_extract(metadata,'$.creator'))`,
  ).run(...creatorParams);
  db.exec(
    "CREATE INDEX temp.metric_creators_address ON metric_creators(address);ALTER TABLE temp.metric_profiles ADD COLUMN poolsCreated INTEGER; UPDATE metric_profiles SET poolsCreated=COALESCE((SELECT n FROM metric_creators WHERE metric_creators.address=metric_profiles.address),0);DROP TABLE temp.metric_creators",
  );
  const summary = db
    .prepare(
      `SELECT COUNT(*) totalWallets,COALESCE(SUM(volumeUsd),0) totalVolumeUsd,
    COALESCE(SUM(swaps),0) swapCount,COALESCE(SUM(transactions),0) transactionCount,
    COALESCE(SUM(pricedSwaps),0) pricedSwaps,COALESCE(SUM(spotEstimatedSwaps),0) spotEstimatedSwaps,
    COALESCE(SUM(lastActive>=?),0) active24h,COALESCE(SUM(lastActive>=?),0) active7d,
    COALESCE(SUM(volumeUsd>0),0) positiveWallets FROM metric_profiles`,
    )
    .get(until - 86400, until - 604800) as {
    totalWallets: number;
    totalVolumeUsd: number;
    swapCount: number;
    transactionCount: number;
    pricedSwaps: number;
    spotEstimatedSwaps: number;
    active24h: number;
    active7d: number;
    positiveWallets: number;
  };
  const size = Math.min(
    Math.max(1, Math.ceil(summary.totalWallets / 100)),
    summary.positiveWallets,
  );
  const cutoff = size
    ? Number(
        db
          .prepare(
            "SELECT volumeUsd FROM metric_profiles ORDER BY volumeUsd DESC LIMIT 1 OFFSET ?",
          )
          .get(size - 1)?.volumeUsd,
      )
    : null;
  const top =
    cutoff === null
      ? { n: 0, volume: 0 }
      : (db
          .prepare(
            "SELECT COUNT(*) n,SUM(volumeUsd) volume FROM metric_profiles WHERE volumeUsd>=? AND volumeUsd>0",
          )
          .get(cutoff) as { n: number; volume: number });
  const top10 = Number(
    db
      .prepare(
        "SELECT COALESCE(SUM(volumeUsd),0) n FROM (SELECT volumeUsd FROM metric_profiles ORDER BY volumeUsd DESC LIMIT 10)",
      )
      .get()?.n ?? 0,
  );
  const middle = summary.totalWallets
    ? db
        .prepare(
          "SELECT volumeUsd FROM metric_profiles ORDER BY volumeUsd DESC LIMIT ? OFFSET ?",
        )
        .all(
          summary.totalWallets % 2 ? 1 : 2,
          Math.floor((summary.totalWallets - 1) / 2),
        )
        .map((r) => Number(r.volumeUsd))
    : [];
  const rows = db
    .prepare(
      "SELECT *,RANK() OVER(ORDER BY volumeUsd DESC) rank FROM metric_profiles ORDER BY volumeUsd DESC,address LIMIT 1000",
    )
    .all() as unknown as (Omit<Wallet, "chains"> & { chains: string })[];
  const wallets: Wallet[] = rows.map((w) => ({
    ...w,
    chains: w.chains.split(",").map(Number),
    favoritePool: "—",
    topPercent: (100 * w.rank) / summary.totalWallets,
    cohort:
      cutoff !== null && w.volumeUsd >= cutoff && w.volumeUsd > 0
        ? "Top 1%"
        : "Rest",
    sharePct: summary.totalVolumeUsd
      ? (100 * w.volumeUsd) / summary.totalVolumeUsd
      : 0,
  }));
  if (wallets.length) {
    const favoriteRows = db
      .prepare(
        `SELECT trader,chain_id,pool_address,SUM(COALESCE(volume_usd,0)) v FROM swaps INDEXED BY swaps_analytics_cover WHERE ${where} AND trader IN (${wallets.map(() => "?").join(",")}) GROUP BY trader,chain_id,pool_address ORDER BY trader,v DESC,pool_address`,
      )
      .all(...params, ...wallets.map((w) => w.address));
    const names = new Map(
      db
        .prepare(
          "SELECT chain_id,address,json_extract(metadata,'$.pair') pair FROM pools",
        )
        .all()
        .map((p) => [`${p.chain_id}:${p.address}`, String(p.pair)]),
    );
    const favorites = new Map<string, string>();
    for (const p of favoriteRows)
      if (!favorites.has(String(p.trader)))
        favorites.set(
          String(p.trader),
          names.get(`${p.chain_id}:${p.pool_address}`) ?? "—",
        );
    for (const wallet of wallets)
      wallet.favoritePool = favorites.get(wallet.address) ?? "—";
  }
  const daily = db
    .prepare(
      `SELECT CAST(timestamp/86400 AS INTEGER)*86400 day,COUNT(DISTINCT trader) wallets,SUM(COALESCE(volume_usd,0)) volumeUsd FROM swaps INDEXED BY swaps_analytics_cover WHERE ${where} GROUP BY day ORDER BY day`,
    )
    .all(...params);
  console.log(
    `Aggregated ${summary.totalWallets} wallets in ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
  const { positiveWallets, ...metrics } = summary;
  const cohorts: TraderCohort[] = [1, 5, 10].map((percent) => {
    const size = Math.min(
      Math.ceil((summary.totalWallets * percent) / 100),
      summary.positiveWallets,
    );
    const cutoff = size
      ? Number(
          db
            .prepare(
              "SELECT volumeUsd FROM metric_profiles ORDER BY volumeUsd DESC LIMIT 1 OFFSET ?",
            )
            .get(size - 1)?.volumeUsd,
        )
      : null;
    const row =
      cutoff === null
        ? { n: 0, volume: 0, daily: 0 }
        : db
            .prepare(
              "SELECT COUNT(*) n,COALESCE(SUM(volumeUsd),0) volume,COALESCE(SUM(volume24hUsd),0) daily FROM metric_profiles WHERE volumeUsd>=? AND volumeUsd>0",
            )
            .get(cutoff)!;
    const median = (column: string) => {
      const count = Number(row.n);
      if (!count || cutoff === null) return null;
      const middle = db
        .prepare(
          `SELECT ${column} value FROM metric_profiles WHERE volumeUsd>=? AND volumeUsd>0 ORDER BY ${column} LIMIT ? OFFSET ?`,
        )
        .all(cutoff, count % 2 ? 1 : 2, Math.floor((count - 1) / 2));
      return middle.reduce((n, r) => n + Number(r.value), 0) / middle.length;
    };
    return {
      percent,
      cutoffUsd: cutoff,
      wallets: Number(row.n),
      totalVolumeUsd: Number(row.volume),
      volume24hUsd: Number(row.daily),
      medianVolumeUsd: median("volumeUsd"),
      medianVolume24hUsd: median("volume24hUsd"),
      medianTransactions: median("transactions"),
      medianActiveDays: median("activeDays"),
      medianPoolsCreated: missingCreators ? null : median("poolsCreated"),
      creatorCoverageComplete: missingCreators === 0,
    };
  });
  exportProfiles?.(
    db
      .prepare(
        `SELECT address,volumeUsd,swaps,transactions,activeDays,pools,${missingCreators ? "NULL" : "poolsCreated"} poolsCreated,firstSeen,lastActive,pricedSwaps,volume24hUsd,RANK() OVER(ORDER BY volumeUsd DESC) rank FROM metric_profiles ORDER BY address`,
      )
      .iterate() as unknown as Iterable<TradeLookupSource>,
  );
  db.exec("DROP TABLE temp.metric_profiles");
  return {
    ...metrics,
    wallets,
    listedWallets: wallets.length,
    top1Count: top.n,
    top1SharePct: summary.totalVolumeUsd
      ? (100 * top.volume) / summary.totalVolumeUsd
      : 0,
    top10SharePct: summary.totalVolumeUsd
      ? (100 * top10) / summary.totalVolumeUsd
      : 0,
    cutoffUsd: cutoff,
    medianVolumeUsd: middle.length
      ? middle.reduce((a, b) => a + b, 0) / middle.length
      : null,
    daily,
    cohorts,
  };
}
