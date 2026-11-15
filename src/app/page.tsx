"use client";
import { useEffect, useMemo, useState } from "react";
import type { Wallet } from "../core";
import { LiquiditySection, type LPScope } from "./liquidity";
import { CohortSection } from "./cohorts";
import type { TraderCohort } from "../cohorts";
import { WalletCheck } from "./wallet-check";
import type { WalletLookupManifest } from "../wallets";
import { MetricOrbit } from "./metric-orbit";
type Stats = {
  wallets: Wallet[];
  listedWallets?: number;
  totalWallets: number;
  active24h: number;
  active7d: number;
  totalVolumeUsd: number;
  swapCount: number;
  transactionCount: number;
  pricedSwaps: number;
  spotEstimatedSwaps: number;
  top1Count: number;
  top1SharePct: number;
  top10SharePct: number;
  cutoffUsd: number | null;
  medianVolumeUsd: number | null;
  windowComplete: boolean;
  daily: { day: number; wallets: number; volumeUsd: number }[];
  cohorts?: TraderCohort[];
};
type Scope = {
  until: number;
  since: number;
  allTimeComplete: boolean;
  windows: Record<string, Stats>;
};
type Report = {
  generatedAt: number;
  asOf: number;
  since: number;
  poolCount: number;
  scopes: Record<string, Scope>;
  liquidity?: { scopes: Record<string, LPScope> };
  walletLookup?: WalletLookupManifest;
  chains: { id: number; name: string; explorer: string; pools: number }[];
  coverage: {
    chain_id: number;
    status: string;
    from_block: number;
    to_block: number;
    from_timestamp: number;
    to_timestamp: number;
    genesis_block: number;
    error: string | null;
  }[];
};
const n = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);
const money = (v: number | null, compact = true) =>
  v == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 2 : 0,
      }).format(v);
const pct = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(v) + "%";
const short = (s: string) => s.slice(0, 6) + "…" + s.slice(-4);
const date = (s: number) =>
  new Date(s * 1000).toLocaleString("en-US", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export default function Page() {
  const [report, setReport] = useState<Report | null>(null),
    [error, setError] = useState(""),
    [chain, setChain] = useState("0"),
    [period, setPeriod] = useState("24h"),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("volume"),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<Wallet | null>(null),
    [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<"wallet" | "leaders" | "insights">("wallet"),
    [rankingView, setRankingView] = useState<"trading" | "lp">("trading"),
    [hasWallet, setHasWallet] = useState(false);
  function openLiquidity() {
    changeView("leaders");
    setRankingView("lp");
    requestAnimationFrame(() => {
      const details =
        document.querySelector<HTMLDetailsElement>("#liquidity details");
      if (details) {
        details.open = true;
        details.scrollIntoView({
          block: "center",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      }
    });
  }
  function changeView(next: "wallet" | "leaders" | "insights") {
    setView(next);
    setSelected(null);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  async function load() {
    setRefreshing(true);
    try {
      const r = await fetch(
        (process.env.NEXT_PUBLIC_METRIC_SNAPSHOT_URL || "/analytics.json") +
          ((process.env.NEXT_PUBLIC_METRIC_SNAPSHOT_URL || "").includes("?")
            ? "&"
            : "?") +
          "t=" +
          Date.now(),
        { cache: "no-store" },
      );
      if (!r.ok) throw new Error("No indexed snapshot is available yet.");
      setReport(await r.json());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load analytics");
    } finally {
      setRefreshing(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    setPage(1);
    setSelected(null);
  }, [query, period, chain, sort]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "Tab") {
        const controls = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".wallet-modal button,.wallet-modal a",
          ),
        );
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [selected]);
  const scope = report?.scopes[chain],
    stats = scope?.windows[period],
    all = scope?.windows.all;
  const liquidity = report?.liquidity?.scopes[chain];
  const wallets = useMemo(() => {
    const rows = (stats?.wallets ?? []).filter((w) =>
      w.address.includes(query.toLowerCase().trim()),
    );
    return [...rows].sort((a, b) =>
      sort === "swaps"
        ? b.swaps - a.swaps
        : sort === "recent"
          ? b.lastActive - a.lastActive
          : b.volumeUsd - a.volumeUsd || a.rank - b.rank,
    );
  }, [stats, query, sort]);
  const windowLabel =
    period === "24h"
      ? "24 hours"
      : period === "7d"
        ? "7 days"
        : scope?.allTimeComplete
          ? "all time"
          : "indexed period";
  const active24Complete = scope?.windows["24h"].windowComplete,
    active7Complete = scope?.windows["7d"].windowComplete;
  function download() {
    if (!stats) return;
    const columns = [
      "rank",
      "address",
      "volumeUsd",
      "swaps",
      "transactions",
      "avgSwapUsd",
      "sharePct",
      "directRouterPct",
      "favoritePool",
      "lastActive",
    ];
    const csv = [
      columns.join(","),
      ...wallets.map((w) =>
        columns
          .map(
            (k) =>
              '"' +
              String(w[k as keyof Wallet] ?? "").replaceAll('"', '""') +
              '"',
          )
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `metric-traders-${chain}-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <header className="topbar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            changeView("wallet");
          }}
        >
          <span className="brand-icon">
            <img src="/metric-mark.svg" alt="" width="30" height="30" />
          </span>
          metric<span className="brand-tag">INTELLIGENCE</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={view === "wallet" ? "nav-active" : ""}
            aria-current={view === "wallet" ? "page" : undefined}
            onClick={() => changeView("wallet")}
          >
            Wallet checker
          </button>
          <button
            className={view === "leaders" ? "nav-active" : ""}
            aria-current={view === "leaders" ? "page" : undefined}
            onClick={() => changeView("leaders")}
          >
            Leaderboards
          </button>
          <button
            className={view === "insights" ? "nav-active" : ""}
            aria-current={view === "insights" ? "page" : undefined}
            onClick={() => changeView("insights")}
          >
            Insights
          </button>
        </nav>
        <div className="source">
          <a href="https://metric.xyz/" target="_blank" rel="noreferrer">
            Metric protocol ↗
          </a>
        </div>
      </header>
      <main className={hasWallet ? "has-wallet" : ""}>
        <div hidden={view !== "wallet"} className="wallet-view">
          <div className="eyebrow">
            <span>METRIC PROTOCOL</span>
            <span>/</span>WALLET INTELLIGENCE
          </div>
          <div className="hero">
            <div>
              <h1>
                KNOW YOUR
                <br />
                <em>METRIC RANK.</em>
              </h1>
              <p>Your trading volume and liquidity. In perspective.</p>
            </div>
            <MetricOrbit />
            <div className="hero-meta">
              <span className="live-label">
                <i />
                {refreshing ? "Loading snapshot" : "Snapshot"}
              </span>
              <strong>
                {report ? date(report.asOf) + " · Kyiv time" : "—"}
              </strong>
              <button onClick={load} disabled={refreshing} className="refresh">
                ↻ Refresh
              </button>
            </div>
          </div>
          {error && (
            <div role="alert" className="notice error">
              {error}
            </div>
          )}
          <WalletCheck
            manifest={report?.walletLookup}
            network={chain}
            onNetworkChange={setChain}
            chains={report?.chains ?? []}
            trading={scope}
            liquidity={liquidity}
            loading={refreshing || !report}
            example={
              liquidity?.wallets.find(
                (w) => w.address in liquidity.traderWallets,
              )?.address ?? all?.wallets[0]?.address
            }
            onRefresh={load}
            onAddressChange={setHasWallet}
            onOpenLiquidity={openLiquidity}
          />
          <div className="home-summary">
            <div>
              <span>Indexed traders</span>
              <strong>{all ? n(all.totalWallets) : "—"}</strong>
            </div>
            <div>
              <span>All-time volume ≈</span>
              <strong>{all ? money(all.totalVolumeUsd) : "—"}</strong>
            </div>
            <div>
              <span>Active liquidity ≈</span>
              <strong>
                {liquidity ? money(liquidity.knownActiveLiquidityUsd) : "—"}
              </strong>
            </div>
            <a
              href="#leaderboard"
              onClick={(e) => {
                e.preventDefault();
                changeView("leaders");
              }}
            >
              Explore the rankings <Arrow />
            </a>
          </div>
        </div>
        <div hidden={view === "wallet"} className="protocol-view" key={view}>
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow">
                METRIC /{" "}
                {view === "leaders" ? "LEADERBOARDS" : "PROTOCOL INSIGHTS"}
              </span>
              <h1>
                {view === "leaders"
                  ? "The market, ranked."
                  : "See the bigger picture."}
              </h1>
              <p>
                {view === "leaders"
                  ? "Explore the wallets behind Metric’s volume and liquidity."
                  : "Volume concentration, cohort benchmarks and protocol activity."}
              </p>
            </div>
            <span className="snapshot-tag">
              Snapshot · {report ? date(report.asOf) : "Loading"}
            </span>
          </div>
          {view === "leaders" && (
            <div className="ranking-tabs" aria-label="Ranking type">
              <button
                aria-pressed={rankingView === "trading"}
                onClick={() => setRankingView("trading")}
              >
                Trading volume
              </button>
              <button
                aria-pressed={rankingView === "lp"}
                onClick={() => setRankingView("lp")}
              >
                LP liquidity
              </button>
            </div>
          )}
          <section className="controls">
            <div className="chain-filters" aria-label="Network filter">
              {[
                { id: 0, name: "All networks" },
                ...(report?.chains ?? [
                  { id: 1, name: "Ethereum" },
                  { id: 56, name: "BNB Chain" },
                  { id: 4663, name: "Robinhood" },
                ]),
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChain(String(c.id))}
                  aria-pressed={chain === String(c.id)}
                  className={chain === String(c.id) ? "active" : ""}
                >
                  {c.id > 0 && <span className={"chain-dot chain-" + c.id} />}{" "}
                  {c.name}
                </button>
              ))}
            </div>
            <div
              className="periods"
              aria-label="Leaderboard period"
              hidden={view === "leaders" && rankingView === "lp"}
            >
              {[
                ["24h", "24h"],
                ["7d", "7d"],
                [
                  "all",
                  scope?.allTimeComplete ? "All time" : "Indexed history",
                ],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  aria-pressed={period === key}
                  className={period === key ? "active" : ""}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
          {scope && (
            <div className="coverage-note">
              <span className="tiny-dot" />
              {scope.allTimeComplete
                ? "Complete history of registered pools"
                : "Historical backfill in progress"}
              <span className="coverage-range">
                {date(scope.since)} — {date(scope.until)} · {report?.poolCount}{" "}
                registered pools
              </span>
            </div>
          )}
          <section
            className="kpis"
            aria-label="Key metrics"
            hidden={view === "leaders" && rankingView === "lp"}
          >
            <Metric
              label={
                scope?.allTimeComplete ? "Total traders" : "Indexed wallets"
              }
              value={all ? n(all.totalWallets) : "—"}
              note={
                scope?.allTimeComplete
                  ? "Unique addresses across all indexed history"
                  : "All-time total awaits complete historical coverage"
              }
              index="01"
            />
            <Metric
              label="Active traders · 24h"
              value={all ? n(all.active24h) : "—"}
              note={
                active24Complete
                  ? "At least one swap in the last 24 hours"
                  : "Partially indexed activity window"
              }
              index="02"
              accent
            />
            <Metric
              label="Active traders · 7d"
              value={active7Complete && all ? n(all.active7d) : "—"}
              note={
                active7Complete
                  ? "Unique addresses over the last 7 days"
                  : "Waiting for complete 7-day coverage"
              }
              index="03"
            />
            <Metric
              label={"Volume · " + windowLabel}
              value={stats ? money(stats.totalVolumeUsd) : "—"}
              note={
                stats
                  ? n(stats.swapCount) + " swaps · estimated USD"
                  : "Estimated pool-swap volume"
              }
              index="04"
            />
          </section>
          <section
            className="analysis-grid"
            id="analysis"
            hidden={view !== "insights"}
          >
            <article className="panel concentration">
              <div className="panel-top">
                <span className="eyebrow">01 / CONCENTRATION</span>
                <span className="pill">TOP 1%</span>
              </div>
              <div className="big-stat">
                {stats ? pct(stats.top1SharePct) : "—"}
                <span>volume</span>
              </div>
              <h2>Volume concentration.</h2>
              <p>
                {stats ? (
                  <>
                    {n(stats.top1Count)}{" "}
                    {stats.top1Count === 1
                      ? "address accounts for"
                      : "addresses account for"}{" "}
                    {pct(stats.top1SharePct)} of estimated volume over{" "}
                    {windowLabel}.
                  </>
                ) : (
                  "Loading onchain data…"
                )}
              </p>
              <div
                className="share-bar"
                role="img"
                aria-label={
                  "Top 1% volume share: " +
                  (stats ? pct(stats.top1SharePct) : "—")
                }
              >
                <span style={{ width: (stats?.top1SharePct ?? 0) + "%" }} />
              </div>
              <div className="legend">
                <span>
                  <i />
                  Top 1%
                </span>
                <span>
                  <i />
                  Other addresses
                </span>
              </div>
              <div className="cutoff">
                <span>Cohort entry threshold</span>
                <strong>{stats ? money(stats.cutoffUsd) : "—"}</strong>
              </div>
              <small>
                Cohort size rounds up; ties at the cutoff are included.
              </small>
            </article>
            <article className="panel distribution">
              <div className="panel-top">
                <div>
                  <span className="eyebrow">02 / VOLUME DISTRIBUTION</span>
                  <h2>The top 10 addresses</h2>
                </div>
                <span className="subtle">
                  {stats ? pct(stats.top10SharePct) : "—"} of total volume
                </span>
              </div>
              <div
                className="volume-chart"
                role="group"
                aria-label="Volume comparison of the ten largest traders"
              >
                {(stats?.wallets.slice(0, 10) ?? []).map((w, i) => (
                  <button
                    className="chart-column"
                    key={w.address}
                    onClick={() => setSelected(w)}
                    title={`${w.address}: ${money(w.volumeUsd, false)}`}
                  >
                    <span>{money(w.volumeUsd)}</span>
                    <div className="bar-track">
                      <i
                        className={i === 0 ? "first" : ""}
                        style={{
                          height:
                            Math.max(
                              2,
                              (100 * w.volumeUsd) /
                                (stats?.wallets[0]?.volumeUsd || 1),
                            ) + "%",
                        }}
                      />
                    </div>
                    <label>{String(i + 1).padStart(2, "0")}</label>
                  </button>
                ))}
              </div>
              <div className="chart-footer">
                <span>Address rank by volume</span>
                <span>
                  Select a bar to explore the wallet <Arrow />
                </span>
              </div>
              <div className="mini-metrics">
                <div>
                  <span>Median wallet volume</span>
                  <strong>{stats ? money(stats.medianVolumeUsd) : "—"}</strong>
                </div>
                <div>
                  <span>Swaps with a USD estimate</span>
                  <strong>
                    {stats?.swapCount
                      ? pct((100 * stats.pricedSwaps) / stats.swapCount)
                      : "—"}
                  </strong>
                </div>
                <div>
                  <span>Transactions</span>
                  <strong>{stats ? n(stats.transactionCount) : "—"}</strong>
                </div>
              </div>
            </article>
          </section>
          <section
            className="panel leaderboard"
            id="leaderboard"
            hidden={view !== "leaders" || rankingView !== "trading"}
          >
            <div className="table-heading">
              <div>
                <span className="eyebrow">TRADING VOLUME</span>
                <h2>
                  Traders by volume{" "}
                  <span>{stats ? n(stats.totalWallets) : "—"}</span>
                </h2>
              </div>
              <button className="export" onClick={download} disabled={!stats}>
                ↓ Export CSV
              </button>
            </div>
            <div className="table-controls">
              <label className="search">
                <span aria-hidden="true">⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search wallet address 0x…"
                  aria-label="Search wallets"
                />
              </label>
              <label className="sort">
                Sort by{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="volume">Volume ↓</option>
                  <option value="swaps">Swap count ↓</option>
                  <option value="recent">Latest activity ↓</option>
                </select>
              </label>
            </div>
            {stats && stats.wallets.length < stats.totalWallets && (
              <p className="listing-note">
                Top {n(stats.wallets.length)} of {n(stats.totalWallets)}{" "}
                traders. Search and CSV cover listed wallets.
              </p>
            )}
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Wallet / cohort</th>
                    <th className="numeric">Volume, USD ≈</th>
                    <th className="numeric">Share</th>
                    <th className="numeric">Swaps</th>
                    <th className="numeric">Avg. swap ≈</th>
                    <th>Favorite pool</th>
                    <th>Last active</th>
                    <th>
                      <span className="sr-only">Profile</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.slice((page - 1) * 20, page * 20).map((w) => (
                    <tr key={w.address}>
                      <td>
                        <span className={w.rank <= 3 ? "rank leading" : "rank"}>
                          {String(w.rank).padStart(2, "0")}
                        </span>
                      </td>
                      <td>
                        <button
                          className="wallet-link"
                          onClick={() => setSelected(w)}
                        >
                          <span
                            className="identicon"
                            style={{
                              background: `hsl(${parseInt(w.address.slice(2, 6), 16) % 360} 35% 25%)`,
                            }}
                          />
                          {short(w.address)}
                        </button>
                        {w.cohort === "Top 1%" && (
                          <span className="cohort">TOP 1%</span>
                        )}
                      </td>
                      <td className="numeric volume-cell">
                        {w.pricedSwaps ? money(w.volumeUsd, false) : "Unpriced"}
                        <div className="row-bar">
                          <i style={{ width: w.sharePct + "%" }} />
                        </div>
                      </td>
                      <td className="numeric">{pct(w.sharePct)}</td>
                      <td className="numeric">{n(w.swaps)}</td>
                      <td className="numeric">{money(w.avgSwapUsd, false)}</td>
                      <td>
                        <span className="pool-tag">{w.favoritePool}</span>
                      </td>
                      <td className="time-cell">{date(w.lastActive)}</td>
                      <td>
                        <button
                          className="open-wallet"
                          onClick={() => setSelected(w)}
                          aria-label={"Open " + w.address}
                        >
                          <Arrow />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stats && !wallets.length && (
              <div className="empty">
                {query
                  ? "No matching address in this leaderboard and network."
                  : "No swaps indexed for this period yet."}
              </div>
            )}
            <div className="pagination">
              <span>
                {wallets.length
                  ? `${(page - 1) * 20 + 1}–${Math.min(page * 20, wallets.length)} of ${n(wallets.length)} addresses`
                  : "0 addresses"}{" "}
                · {windowLabel}
              </span>
              <div>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  ←
                </button>
                <span>
                  {page} / {Math.max(1, Math.ceil(wallets.length / 20))}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 20 >= wallets.length}
                  aria-label="Next page"
                >
                  →
                </button>
              </div>
            </div>
          </section>
          <div hidden={view !== "insights"}>
            <CohortSection
              cohorts={all?.cohorts}
              liquidity={liquidity}
              complete={scope?.allTimeComplete ?? false}
              asOf={scope?.until}
            />
          </div>
          <div hidden={view !== "leaders" || rankingView !== "lp"}>
            <LiquiditySection data={liquidity} chains={report?.chains ?? []} />
          </div>
          <div hidden={view !== "insights"}>
            <section className="method" id="method">
              <div>
                <span className="eyebrow">ABOUT THE DATA</span>
                <h2>About the data.</h2>
                <p>
                  This leaderboard describes address activity, not profitability
                  or a count of people.
                </p>
              </div>
              <div className="method-items">
                <details>
                  <summary>What counts as a trader?</summary>
                  <p>
                    A unique transaction sender (tx.from), deduplicated across
                    networks. Swap.sender identifies the execution router
                    separately. An address may belong to a bot, solver, relayer
                    or bundler and may represent other users.
                  </p>
                </details>
                <details>
                  <summary>How is volume calculated?</summary>
                  <p>
                    One token leg per Swap event. Allowlisted USDC/USDT
                    quantities are valued at $1; other tokens use the latest API
                    spot price. These are estimates, not historical execution
                    prices. Unpriced swaps count toward activity but are
                    excluded from volume. A multi-pool route can generate
                    multiple swaps in a single transaction.
                  </p>
                </details>
                <details>
                  <summary>How is the top 1% defined?</summary>
                  <p>
                    The first ceil(N / 100) addresses ranked by estimated
                    volume, including ties at the cutoff. For small samples, the
                    actual share of wallets may exceed 1%. High volume does not
                    establish profitability.
                  </p>
                </details>
                <details>
                  <summary>Coverage and freshness</summary>
                  <p>
                    A static snapshot from the local indexer. Refresh reloads
                    the latest published snapshot; it does not trigger indexing.
                    The 24-hour and 7-day windows end at the indexed cutoff.
                    Cross-network comparisons use a common covered interval. The
                    all-time total becomes available after indexing from pool
                    creation.
                  </p>
                  <ul>
                    {report?.coverage.map((c) => (
                      <li key={c.chain_id}>
                        {report.chains.find((x) => x.id === c.chain_id)?.name}:{" "}
                        {n(c.from_block)}–{n(c.to_block)} · {c.status}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </section>
          </div>
        </div>
        <footer>
          <a
            className="brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changeView("wallet");
            }}
          >
            metric<span className="brand-tag">INTELLIGENCE</span>
          </a>
          <span>
            Indexed onchain ·{" "}
            {report ? "As of " + date(report.asOf) : "Loading"}
          </span>
          <a
            href="https://github.com/Nerevarine22/dbmetric"
            target="_blank"
            rel="noreferrer"
          >
            Project source <Arrow />
          </a>
        </footer>
      </main>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="wallet-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="close"
              onClick={() => setSelected(null)}
              aria-label="Close profile"
            >
              ×
            </button>
            <span className="eyebrow">WALLET PROFILE / {windowLabel}</span>
            <h2 id="wallet-title">Trader #{selected.rank}</h2>
            <p className="full-address">{selected.address}</p>
            <div className="profile-stats">
              <div>
                <span>Estimated volume</span>
                <strong>{money(selected.volumeUsd, false)}</strong>
              </div>
              <div>
                <span>Volume share</span>
                <strong>{pct(selected.sharePct)}</strong>
              </div>
              <div>
                <span>Swaps / transactions</span>
                <strong>
                  {n(selected.swaps)} / {n(selected.transactions)}
                </strong>
              </div>
              <div>
                <span>Direct router</span>
                <strong>{pct(selected.directRouterPct)}</strong>
              </div>
              <div>
                <span>Active days (UTC)</span>
                <strong>{n(selected.activeDays)}</strong>
              </div>
              <div>
                <span>Pools / networks</span>
                <strong>
                  {selected.pools} / {selected.chains.length}
                </strong>
              </div>
            </div>
            <p className="profile-note">
              {liquidity?.traderWallets &&
                selected.address in liquidity.traderWallets && (
                  <>
                    <strong>LP profile:</strong>{" "}
                    {liquidity.traderWallets[selected.address]
                      ? `active ${money(liquidity.traderWallets[selected.address]!.activeUsd)} · lifetime deposits ${money(liquidity.traderWallets[selected.address]!.lifetimeDepositsUsd)}`
                      : liquidity.historyComplete
                        ? "No LP events in the indexed history"
                        : "LP history incomplete"}
                    <br />
                  </>
                )}
              First seen in this window: {date(selected.firstSeen)}
              <br />
              Last active: {date(selected.lastActive)}
              <br />
              Favorite pool by volume: {selected.favoritePool}
            </p>
            <div className="explorer-links">
              {selected.chains.map((id) => (
                <a
                  key={id}
                  target="_blank"
                  rel="noreferrer"
                  href={
                    (report?.chains.find((c) => c.id === id)?.explorer ?? "") +
                    "/address/" +
                    selected.address
                  }
                >
                  {report?.chains.find((c) => c.id === id)?.name} <Arrow />
                </a>
              ))}
            </div>
            <p className="disclaimer">
              Volume is estimated in USD. This profile describes a transaction
              sender and does not establish profitability or identify an
              individual person.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
function Metric({
  label,
  value,
  note,
  index,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  index: string;
  accent?: boolean;
}) {
  return (
    <article className={"metric" + (accent ? " metric-accent" : "")}>
      <div className="metric-label">
        {label}
        <span>{index}</span>
      </div>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
