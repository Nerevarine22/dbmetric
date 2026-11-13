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
  const globalScope = scopes[0] as {
    allTimeComplete: boolean;
    windows: Record<string, ReturnType<typeof sqlAnalytics>>;
  };
  const usd = (v: number | null) =>
    v == null
      ? "Unavailable"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(v);
  const count = (v: number) => new Intl.NumberFormat("en-US").format(v);
  const lines = [
    "# Metric trader analysis",
    "",
    `Indexed cutoff: ${new Date(until * 1000).toISOString()}. Networks: Ethereum, BNB Chain, Robinhood.`,
    `All-time registry coverage: ${globalScope.allTimeComplete ? "complete" : "partial"}.`,
    "",
    "| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const [key, s] of Object.entries(globalScope.windows))
    lines.push(
      `| ${key} | ${count(s.totalWallets)} | ${count(s.swapCount)} | ${usd(s.totalVolumeUsd)} | ${s.top1SharePct.toFixed(2)}% | ${s.top10SharePct.toFixed(2)}% |`,
    );
  const s = globalScope.windows["24h"];
  lines.push(
    "",
    "## Top addresses over 24 hours",
    "",
    "| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |",
    "| ---: | --- | ---: | ---: | ---: | ---: | --- |",
  );
  for (const w of s.wallets.slice(0, 10)) {
    const explorer = CHAINS.find((c) => c.id === w.chains[0])?.explorer;
    lines.push(
      `| ${w.rank} | [${w.address}](${explorer}/address/${w.address}) | ${usd(w.volumeUsd)} | ${count(w.swaps)} | ${count(w.transactions)} | ${w.directRouterPct.toFixed(1)}% | ${w.favoritePool.replaceAll("|", "/")} |`,
    );
  }
  lines.push(
    "",
    "## Interpretation",
    "",
    `The top-volume cohort contains ${count(s.top1Count)} addresses and accounts for ${s.top1SharePct.toFixed(2)}% of estimated 24-hour pool turnover. Its entry cutoff is ${usd(s.cutoffUsd)}, compared with median wallet volume of ${usd(s.medianVolumeUsd)}.`,
    `Of ${count(s.swapCount)} swaps, ${count(s.pricedSwaps)} have a USD estimate; ${count(s.spotEstimatedSwaps)} use current metadata prices rather than a stable-unit estimate.`,
    `Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.`,
    "",
    "This analysis covers transaction senders in registered canonical-factory pools. It does not measure LP users, LP TVL, profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.",
  );
  fs.writeFileSync("ANALYSIS.md", lines.join("\n") + "\n");
  return report;
}
