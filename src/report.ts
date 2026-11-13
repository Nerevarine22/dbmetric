import type { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { CHAINS } from "./core";
import { loadPools } from "./db";
import { sqlAnalytics } from "./sqlAnalytics";
import { archiveSnapshot } from "./snapshots";
export function exportReport(db: DatabaseSync) {
  const pools = loadPools(db);
  const coverage = db
    .prepare("SELECT * FROM coverage ORDER BY chain_id")
    .all() as {
    chain_id: number;
    from_block: number;
    from_timestamp: number;
    to_block: number;
    to_timestamp: number;
    genesis_block: number;
    status: string;
    error: string | null;
  }[];
  const through =
    coverage.length === CHAINS.length
      ? Math.min(...coverage.map((c) => c.to_timestamp))
      : 0;
  const generatedAt = Math.floor(Date.now() / 1000);
  const until = through || generatedAt;
  const start = coverage.length
    ? Math.max(...coverage.map((c) => c.from_timestamp))
    : until;
  const scopes: Record<string, unknown> = {};
  for (const chainId of [0, ...CHAINS.map((c) => c.id)]) {
    const relevant = coverage.filter((c) => !chainId || c.chain_id === chainId);
    const scopeUntil = relevant.length
      ? Math.min(...relevant.map((c) => c.to_timestamp))
      : until;
    const scopeStart = relevant.length
      ? Math.max(...relevant.map((c) => c.from_timestamp))
      : until;
    const complete =
      relevant.length === (chainId ? 1 : CHAINS.length) &&
      relevant.every((c) => c.status === "complete");
    const allTimeComplete =
      complete && relevant.every((c) => c.from_block <= c.genesis_block);
    scopes[chainId] = {
      until: scopeUntil,
      since: allTimeComplete
        ? Math.min(...relevant.map((c) => c.from_timestamp))
        : scopeStart,
      allTimeComplete,
      windows: Object.fromEntries(
        (
          [
            ["24h", 86400],
            ["7d", 604800],
            ["all", Infinity],
          ] as const
        ).map(([key, seconds]) => [
          key,
          {
            ...sqlAnalytics(
              db,
              key === "all" && allTimeComplete
                ? 0
                : Math.max(scopeStart, scopeUntil - seconds),
              scopeUntil,
              chainId,
            ),
            windowComplete:
              complete &&
              (key === "all"
                ? allTimeComplete
                : scopeStart <= scopeUntil - seconds + 15),
          },
        ]),
      ),
    };
  }
  const report = {
    generatedAt,
    asOf: until,
    since: start,
    poolCount: pools.length,
    chains: CHAINS.map((c) => ({
      id: c.id,
      name: c.name,
      explorer: c.explorer,
      pools: pools.filter((p) => p.chainId === c.id).length,
    })),
    coverage,
    scopes,
    methodology: {
      user: "Unique transaction sender (tx.from), deduplicated across chains. Relayers, bots, solvers and account-abstraction bundlers may represent other users.",
      volume:
        "Sum of one token leg per pool Swap. Multi-hop routes can count multiple pool swaps in one transaction; this measures pool-level turnover attributed to transaction senders, not user deposits or profit.",
      pricing:
        "USD estimates: allowlisted stablecoin quantity at $1; otherwise latest metadata spot price, not historical execution USD. Unpriced swaps remain in user/activity counts and are excluded from volume.",
      cohort:
        "Top ceil(N / 100) addresses by estimated volume; ties at cutoff included. Small cohorts can exceed 1%. Not a profitability or smart-money signal.",
      coverage:
        "All chains use the common covered time interval. All-time count is available only after scanning every registered pool from creation. 24h/7d activity is measured at the indexed cutoff, not browser time.",
    },
  };
  fs.mkdirSync("public", { recursive: true });
  const tmp = "public/analytics.json.tmp";
  fs.writeFileSync(tmp, JSON.stringify(report));
  fs.renameSync(tmp, "public/analytics.json");
  fs.writeFileSync("data/latest-report.json", JSON.stringify(report, null, 2));
  archiveSnapshot(db, report);
  return report;
}
