import type { TraderCohort } from "../cohorts";
import type { LPScope } from "./liquidity";
const count = (v: number | null | undefined) =>
  v == null
    ? "Unavailable"
    : new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(v);
const usd = (v: number | null | undefined) =>
  v == null
    ? "Unavailable"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(v);
type LPGroup = LPScope["traderCohorts"][number];
export function CohortSection({
  cohorts,
  liquidity,
  complete,
  asOf,
}: {
  cohorts?: TraderCohort[];
  liquidity?: LPScope;
  complete: boolean;
  asOf?: number;
}) {
  if (!cohorts?.length) return null;
  const lp = (c: TraderCohort) =>
    liquidity?.historyComplete
      ? liquidity.traderCohorts.find(
          (g) =>
            g.percent === c.percent &&
            g.traderWallets === c.wallets &&
            g.volumeCutoffUsd === c.cutoffUsd,
        )
      : undefined;
  const participation = (
    g: LPGroup | undefined,
    key: "lpEver" | "activeLPs",
  ) =>
    g
      ? `${count(g[key])} / ${count(g.traderWallets)} (${g.traderWallets ? ((100 * g[key]) / g.traderWallets).toFixed(1) : "0"}%)`
      : "Unavailable";
  const rows: {
    label: string;
    value: (c: TraderCohort) => string;
    group?: boolean;
  }[] = [
    { label: "Wallets in cohort", value: (c) => count(c.wallets) },
    { label: "Volume entry threshold ≈", value: (c) => usd(c.cutoffUsd) },
    { label: "Trading · same wallets", value: () => "", group: true },
    { label: "Lifetime volume · total ≈", value: (c) => usd(c.totalVolumeUsd) },
    {
      label: "Volume in last 24h · total ≈",
      value: (c) => usd(c.volume24hUsd),
    },
    {
      label: "Lifetime volume · median ≈",
      value: (c) => usd(c.medianVolumeUsd),
    },
    {
      label: "Volume in last 24h · median ≈",
      value: (c) => usd(c.medianVolume24hUsd),
    },
    {
      label: "Swap transactions · median",
      value: (c) => count(c.medianTransactions),
    },
    {
      label: "Active swap days (UTC) · median",
      value: (c) => count(c.medianActiveDays),
    },
    {
      label: "Pools created · median",
      value: (c) => count(c.medianPoolsCreated),
    },
    { label: "Liquidity · same wallets", value: () => "", group: true },
    {
      label: "Ever provided liquidity",
      value: (c) => participation(lp(c), "lpEver"),
    },
    {
      label: "Currently holds LP shares",
      value: (c) => participation(lp(c), "activeLPs"),
    },
    {
      label: "Known active liquidity · total ≈",
      value: (c) => usd(lp(c)?.totalKnownActiveUsd),
    },
    {
      label: "Active liquidity · median, all wallets ≈",
      value: (c) => usd(lp(c)?.medianActiveUsdAcrossAllTraders),
    },
    {
      label: "Lifetime deposits · median, all wallets ≈",
      value: (c) => usd(lp(c)?.medianLifetimeDepositsUsdAcrossAllTraders),
    },
    {
      label: "Active liquidity · median, active LPs only ≈",
      value: (c) => usd(lp(c)?.medianActiveUsdAmongValuedLPs),
    },
    {
      label: "Lifetime deposits · median, historical LPs only ≈",
      value: (c) => usd(lp(c)?.medianLifetimeDepositsUsdAmongPricedLPs),
    },
  ];
  return (
    <section
      className="panel leaderboard cohort-section"
      id="cohorts"
      aria-labelledby="cohorts-title"
    >
      <div className="table-heading">
        <div>
          <span className="eyebrow">LIFETIME COHORTS</span>
          <h2 id="cohorts-title">Top trader benchmarks.</h2>
        </div>
        <span className="pill">
          BY {complete ? "LIFETIME" : "INDEXED"} SWAP VOLUME
        </span>
      </div>
      <p className="listing-note">
        The same wallets across trading and liquidity. Groups are nested and
        ranked by lifetime volume.
      </p>
      {!complete && (
        <p className="notice" role="status">
          Full lifetime trading coverage is unavailable. These cohorts describe
          indexed history.
        </p>
      )}
      {!liquidity?.historyComplete && (
        <p className="listing-note">
          LP history is incomplete; liquidity comparisons are unavailable.
        </p>
      )}
      {liquidity?.historyComplete && !liquidity.rankingComplete && (
        <p className="listing-note">
          Some LP positions lack prices or verification. Liquidity totals
          include known amounts; LP-only medians exclude unpriced portfolios.
        </p>
      )}
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Top trader cohort metrics"
      >
        <table className="cohort-table">
          <thead>
            <tr>
              <th>Metric</th>
              {cohorts.map((c) => (
                <th key={c.percent} className="numeric">
                  Top {c.percent}% traders
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              row.group ? (
                <tr className="cohort-divider" key={row.label}>
                  <th colSpan={4}>{row.label}</th>
                </tr>
              ) : (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {cohorts.map((c) => (
                    <td className="numeric" key={c.percent}>
                      {row.value(c)}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <details className="cohort-notes">
        <summary>How to read these benchmarks</summary>
        <p className="listing-note">
          Medians summarize the group; only the volume entry threshold
          determines membership. All-wallet LP medians include zero for
          addresses with no LP history. LP-only medians use the stated subset
          and exclude missing prices. Transactions count unique swap
          transactions; pool creators come from canonical metadata.
        </p>
        <p className="listing-note">
          24h volume is measured at{" "}
          {asOf
            ? new Date(asOf * 1000).toLocaleString("en-GB", {
                timeZone: "Europe/Kyiv",
              })
            : "the trading snapshot cutoff"}{" "}
          Kyiv. LP balances use per-chain snapshot blocks. Historical deposits
          are repriced at synced spot quotes; repeated capital is counted.
        </p>
      </details>
    </section>
  );
}
