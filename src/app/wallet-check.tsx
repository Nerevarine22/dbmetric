"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  checkedShard,
  normalizeWallet,
  rankCohort,
  rankPosition,
  readTrade,
  type WalletEntry,
  type WalletLookupManifest,
  type WalletPeriod,
  type WalletShard,
} from "../wallets";
import type { LPScope } from "./liquidity";
type TradePopulation = {
  totalWallets: number;
  windowComplete: boolean;
  cohorts?: { percent: number; cutoffUsd: number | null }[];
};
type Props = {
  manifest?: WalletLookupManifest;
  network: string;
  onNetworkChange: (value: string) => void;
  chains: { id: number; name: string; explorer: string }[];
  trading?: {
    until: number;
    allTimeComplete: boolean;
    windows: Record<string, TradePopulation>;
  };
  liquidity?: LPScope;
  loading: boolean;
  example?: string;
  onRefresh: () => void;
  onAddressChange: (active: boolean) => void;
  onOpenLiquidity: () => void;
};
const number = (v: number | null | undefined) =>
  v == null
    ? "—"
    : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);
const usd = (v: number | null | undefined) =>
  v == null
    ? "Unpriced"
    : v > 0 && v < 0.01
      ? "<$0.01"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(v);
const date = (v: number) =>
  new Date(v * 1000).toLocaleString("en-GB", {
    timeZone: "UTC",
    timeZoneName: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
export function WalletCheck({
  manifest,
  network,
  onNetworkChange,
  chains,
  trading,
  liquidity,
  loading,
  example,
  onRefresh,
  onAddressChange,
  onOpenLiquidity,
}: Props) {
  const [input, setInput] = useState(""),
    [address, setAddress] = useState(""),
    [validation, setValidation] = useState(""),
    [period, setPeriod] = useState<WalletPeriod>("all"),
    [copyStatus, setCopyStatus] = useState("");
  const [lookup, setLookup] = useState<{
    key: string;
    entry: WalletEntry | null;
    error: string;
    pending: boolean;
  } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const queryKey = `${manifest?.snapshotId}:${network}:${address}`;
  useEffect(() => {
    onAddressChange(!!address);
  }, [address, onAddressChange]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search),
      wallet = normalizeWallet(params.get("wallet") ?? "");
    if (wallet) {
      setInput(wallet);
      setAddress(wallet);
    }
    const net = params.get("network");
    if (net && ["0", "1", "56", "4663"].includes(net)) onNetworkChange(net);
    const p = params.get("walletPeriod");
    if (p === "all" || p === "24h" || p === "7d") setPeriod(p);
  }, [onNetworkChange]);
  useEffect(() => {
    if (!address) return;
    const url = new URL(window.location.href);
    url.searchParams.set("wallet", address);
    url.searchParams.set("network", network);
    url.searchParams.set("walletPeriod", period);
    window.history.replaceState(null, "", url);
    setCopyStatus("");
  }, [address, network, period]);
  useEffect(() => {
    if (!address || !manifest) return;
    const controller = new AbortController(),
      key = `${manifest.snapshotId}:${network}:${address}`;
    setLookup({ key, entry: null, error: "", pending: true });
    const file = manifest.files[network]?.[address.slice(2, 4)];
    if (!file) {
      setLookup({ key, entry: null, error: "", pending: false });
      return;
    }
    const snapshotUrl = new URL(
      process.env.NEXT_PUBLIC_METRIC_SNAPSHOT_URL || "/analytics.json",
      window.location.href,
    );
    const url = new URL(file, snapshotUrl);
    void fetch(url, { signal: controller.signal, cache: "force-cache" })
      .then(async (r) => {
        if (!r.ok)
          throw new Error(
            "The wallet snapshot is unavailable. Refresh the snapshot and try again.",
          );
        const data = (await r.json()) as WalletShard;
        const entry = checkedShard(data, manifest, network, address);
        if (!controller.signal.aborted)
          setLookup({ key, entry, error: "", pending: false });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setLookup({
            key,
            entry: null,
            error:
              e instanceof Error ? e.message : "Unable to check this wallet.",
            pending: false,
          });
      });
    return () => controller.abort();
  }, [address, manifest, network]);
  const current = lookup?.key === queryKey ? lookup : null;
  function focusResult() {
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  function showWallet(value: string) {
    setInput(value);
    setAddress(value);
    setValidation("");
    if (value === address) requestAnimationFrame(focusResult);
  }
  useEffect(() => {
    if (current && !current.pending) {
      focusResult();
    }
  }, [current]);
  function submit(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeWallet(input);
    if (!normalized) {
      setValidation(
        "Enter a complete EVM address: 0x followed by 40 hexadecimal characters.",
      );
      return;
    }
    showWallet(normalized);
  }
  const entry = current?.entry,
    row = entry?.trading[period],
    trade = row ? readTrade(row) : null,
    population = trading?.windows[period],
    lp = entry?.lp;
  const pending = !!address && !!manifest && (!current || current.pending);
  const lpRank =
    liquidity?.historyComplete && lp?.activeUsd !== null
      ? (lp?.rank ?? null)
      : null;
  const tradeTitle = trade?.rank
    ? `#${number(trade.rank)}`
    : trade
      ? trade.pricedSwaps === 0
        ? "USD price unavailable"
        : "Zero estimated volume"
      : "No indexed swaps";
  const lpTitle = lpRank
    ? `#${number(lpRank)}`
    : !liquidity?.historyComplete
      ? "LP history incomplete"
      : !lp
        ? "No LP history"
        : lp.missingCurrentPositions
          ? "Valuation incomplete"
          : lp.openBinPositions
            ? "Zero active value"
            : "Inactive LP";
  return (
    <section
      className="wallet-check"
      id="check"
      aria-labelledby="wallet-check-label"
    >
      <form onSubmit={submit} noValidate>
        <div className="check-form-heading">
          <label id="wallet-check-label" htmlFor="wallet-address">
            Find your wallet
          </label>
          <span className="read-only-label">
            <i /> Read-only
          </span>
        </div>
        <div className="wallet-check-form">
          <div className="address-field">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              id="wallet-address"
              name="wallet"
              placeholder="Paste wallet address · 0x…"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setValidation("");
              }}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="none"
              aria-invalid={!!validation}
              aria-describedby={
                validation ? "wallet-address-error" : "wallet-check-help"
              }
            />
          </div>
          <select
            aria-label="Wallet network"
            value={network}
            onChange={(e) => onNetworkChange(e.target.value)}
          >
            <option value="0">All networks</option>
            {chains.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            className="check-submit"
            type="submit"
            disabled={loading || !manifest}
          >
            {loading ? (
              "Loading…"
            ) : (
              <>
                Check rank <span aria-hidden="true">↗</span>
              </>
            )}
          </button>
        </div>
        {validation && (
          <p
            className="wallet-check-error"
            id="wallet-address-error"
            role="alert"
          >
            {validation}
          </p>
        )}
        <div className="wallet-check-help" id="wallet-check-help">
          <span>No connection. Just your public address.</span>
          {example && (
            <button
              type="button"
              onClick={() => {
                showWallet(example);
              }}
            >
              Try an example <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
        {!loading && !manifest && (
          <p className="wallet-check-error">
            Wallet search is unavailable.{" "}
            <button type="button" onClick={onRefresh}>
              Refresh snapshot
            </button>
          </p>
        )}
      </form>
      {address && (
        <div className="wallet-result" aria-live="polite" aria-busy={pending}>
          <div className="wallet-result-heading">
            <div className="profile-identity">
              <span className="wallet-avatar" aria-hidden="true">
                ◎
              </span>
              <div>
                <span className="eyebrow">WALLET PROFILE</span>
                <h2
                  ref={heading}
                  tabIndex={-1}
                  aria-label={`Wallet ${address}`}
                >
                  {address.slice(0, 6)}
                  <span className="address-ellipsis">…</span>
                  {address.slice(-4)}
                </h2>
                <span className="profile-network">
                  {network === "0"
                    ? "All networks"
                    : chains.find((c) => String(c.id) === network)?.name}
                </span>
              </div>
            </div>
            <button
              className="share-profile"
              aria-label="Copy profile link"
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopyStatus("Link copied");
                } catch {
                  setCopyStatus("Copy the browser URL to share.");
                }
              }}
            >
              {copyStatus === "Link copied" ? "Copied ✓" : "Share profile ↗"}
            </button>
          </div>
          {copyStatus && copyStatus !== "Link copied" && (
            <p className="wallet-check-help" role="status">
              {copyStatus}
            </p>
          )}
          {pending && (
            <div className="rank-loading" role="status">
              <span>Finding your ranks…</span>
              <div />
              <div />
            </div>
          )}
          {current?.error && (
            <p className="notice error" role="alert">
              {current.error}{" "}
              <button className="refresh" onClick={onRefresh}>
                Retry
              </button>
            </p>
          )}
          {current && !current.pending && !current.error && (
            <>
              {!entry ? (
                <div className="wallet-empty">
                  <span aria-hidden="true">⌕</span>
                  <h3>No activity in this snapshot.</h3>
                  <p>
                    No indexed swaps or LP positions on{" "}
                    {network === "0"
                      ? "the covered networks"
                      : chains.find((c) => String(c.id) === network)?.name}
                    .
                  </p>
                  <small>
                    Activity after the snapshot date is not included.
                  </small>
                </div>
              ) : (
                <div className="wallet-rank-grid">
                  <article
                    className="wallet-rank-card trading-rank"
                    key={`trade-${address}-${network}-${period}`}
                  >
                    <div className="wallet-rank-top">
                      <span className="rank-category">
                        <span className="category-index">01</span> Trading
                        volume
                      </span>
                      <div
                        className="periods"
                        aria-label="Wallet volume period"
                      >
                        {(["all", "24h", "7d"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            aria-pressed={period === p}
                            className={period === p ? "active" : ""}
                            onClick={() => setPeriod(p)}
                          >
                            {p === "all" ? "All time" : p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rank-number-line">
                      <strong
                        className={`wallet-rank-number ${trade?.rank ? "" : "rank-empty-number"}`}
                      >
                        {!row && period !== "all"
                          ? "No swaps in this period"
                          : tradeTitle}
                      </strong>
                      {trade?.rank && (
                        <span className="rank-tier">
                          {rankCohort(
                            trade.rank,
                            population?.totalWallets ?? 0,
                          )}
                        </span>
                      )}
                    </div>
                    <p className="rank-population">
                      {trade?.rank ? (
                        <>
                          of {number(population?.totalWallets)} traders{" "}
                          <span>
                            ·{" "}
                            {rankPosition(
                              trade.rank,
                              population?.totalWallets ?? 0,
                            )}
                          </span>
                        </>
                      ) : (
                        "Ranked by estimated swap volume"
                      )}
                    </p>
                    {population && !population.windowComplete && (
                      <p className="wallet-check-error">
                        Partial history · rank covers indexed data.
                      </p>
                    )}
                    <div className="rank-capital">
                      <span>
                        {period === "all"
                          ? "Total volume"
                          : "Volume · " + period}{" "}
                        ≈
                      </span>
                      <strong>
                        {trade && trade.pricedSwaps === 0
                          ? "Unpriced"
                          : usd(trade?.volumeUsd ?? 0)}
                      </strong>
                    </div>
                    <dl className="wallet-check-stats">
                      <Stat
                        label="Transactions"
                        value={number(trade?.transactions ?? 0)}
                      />
                      <Stat
                        label="Active days"
                        value={number(trade?.activeDays ?? 0)}
                      />
                      <Stat
                        label="Pools traded"
                        value={number(trade?.pools ?? 0)}
                      />
                    </dl>
                    <details className="wallet-extra">
                      <summary>More activity</summary>
                      <dl>
                        <Stat
                          label="Pool swaps"
                          value={number(trade?.swaps ?? 0)}
                        />
                        <Stat
                          label="Pools created · all time"
                          value={number(
                            entry.trading.all
                              ? readTrade(entry.trading.all).poolsCreated
                              : trade?.poolsCreated,
                          )}
                        />
                      </dl>
                      {trade && trade.pricedSwaps < trade.swaps && (
                        <p>
                          {number(trade.swaps - trade.pricedSwaps)} swaps have
                          no USD estimate.
                        </p>
                      )}
                    </details>
                    {(!trade || trade.pricedSwaps > 0) && (
                      <Gaps
                        value={trade?.volumeUsd ?? 0}
                        thresholds={population?.cohorts}
                        unit="volume"
                      />
                    )}
                  </article>
                  <article
                    className="wallet-rank-card lp-rank"
                    key={`lp-${address}-${network}`}
                  >
                    <div className="wallet-rank-top">
                      <span className="rank-category">
                        <span className="category-index">02</span> LP liquidity
                      </span>
                      <span className="holding-tag">Active capital</span>
                    </div>
                    <div className="rank-number-line">
                      <strong
                        className={`wallet-rank-number ${lpRank ? "" : "rank-empty-number"}`}
                      >
                        {lpTitle}
                      </strong>
                      {lpRank && (
                        <span className="rank-tier">{lp?.cohort}</span>
                      )}
                    </div>
                    <p className="rank-population">
                      {lpRank ? (
                        <>
                          of {number(liquidity?.valuedActiveLPWallets)}{" "}
                          {liquidity?.rankingComplete
                            ? "active LPs"
                            : "valued LPs"}{" "}
                          <span>
                            ·{" "}
                            {rankPosition(
                              lpRank,
                              liquidity?.valuedActiveLPWallets ?? 0,
                            )}
                          </span>
                        </>
                      ) : (
                        "Ranked by liquidity currently in pools"
                      )}
                    </p>
                    {liquidity && !liquidity.rankingComplete && (
                      <p className="wallet-check-error">
                        Partial valuation · rank covers priced portfolios.
                      </p>
                    )}
                    <div className="rank-capital">
                      <span>Active liquidity ≈</span>
                      <strong>
                        {lp
                          ? usd(lp.activeUsd)
                          : liquidity?.historyComplete
                            ? usd(0)
                            : "Unavailable"}
                      </strong>
                    </div>
                    <dl className="wallet-check-stats">
                      <Stat
                        label="Deposited ≈"
                        value={
                          lp
                            ? usd(lp.lifetimeDepositsUsd)
                            : liquidity?.historyComplete
                              ? usd(0)
                              : "—"
                        }
                      />
                      <Stat
                        label="Withdrawn ≈"
                        value={
                          lp
                            ? usd(lp.lifetimeWithdrawalsUsd)
                            : liquidity?.historyComplete
                              ? usd(0)
                              : "—"
                        }
                      />
                      <Stat
                        label="Positions"
                        value={
                          lp
                            ? number(lp.openPositions)
                            : liquidity?.historyComplete
                              ? "0"
                              : "—"
                        }
                      />
                    </dl>
                    <details className="wallet-extra">
                      <summary>More activity</summary>
                      <dl>
                        <Stat
                          label="Active pools"
                          value={lp ? number(lp.activePools) : "—"}
                        />
                        <Stat
                          label="LP transactions"
                          value={lp ? number(lp.lpTransactions) : "—"}
                        />
                      </dl>
                      <p>
                        Deposits and withdrawals are cumulative, repriced at
                        snapshot quotes.
                      </p>
                    </details>
                    {liquidity?.historyComplete && lp?.activeUsd !== null && (
                      <Gaps
                        value={lp?.activeUsd ?? 0}
                        thresholds={liquidity?.thresholds}
                        unit="active liquidity"
                      />
                    )}
                  </article>
                </div>
              )}
              <div className="profile-bottom">
                <span className="profile-snapshot">
                  <i /> Snapshot ·{" "}
                  {trading ? date(trading.until) : "Unavailable"}
                </span>
                <details className="rank-method">
                  <summary>
                    How rankings work{" "}
                    <span className="disclosure-icon" aria-hidden="true" />
                  </summary>
                  <div>
                    <p>
                      Trading rank compares transaction senders in the selected
                      period. LP rank compares fully USD-valued portfolios with
                      positive active liquidity. Cohorts round up and include
                      ties.
                    </p>
                    <p>
                      Trading cutoff:{" "}
                      {trading ? date(trading.until) : "unavailable"}.
                      LP cutoff:{" "}
                      {liquidity?.asOf
                        ? date(liquidity.asOf)
                        : "unavailable"}
                      .{" "}
                      <button onClick={onOpenLiquidity}>
                        View chain cutoffs ↗
                      </button>
                    </p>
                    <p>
                      USD values are estimates. LP deposits use synced spot
                      quotes and may count repeated capital. Active days use
                      UTC. Positions can belong to strategy or custody
                      contracts.
                    </p>
                    <p className="full-address">{address}</p>
                    <div className="explorer-links">
                      {chains
                        .filter(
                          (c) => network === "0" || String(c.id) === network,
                        )
                        .map((c) => (
                          <a
                            key={c.id}
                            href={`${c.explorer}/address/${address}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {c.name} ↗
                          </a>
                        ))}
                    </div>
                  </div>
                </details>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
function Gaps({
  value,
  thresholds,
  unit,
}: {
  value: number;
  thresholds?: { percent: number; cutoffUsd: number | null }[];
  unit: string;
}) {
  return (
    <div className="wallet-rank-gaps">
      <div className="gap-heading">
        <span>Your next milestones</span>
        <span>Amount to go</span>
      </div>
      {thresholds?.map((t) => {
        const reached = t.cutoffUsd !== null && value >= t.cutoffUsd,
          progress =
            t.cutoffUsd && t.cutoffUsd > 0
              ? Math.min(100, Math.max(0, (value / t.cutoffUsd) * 100))
              : 0;
        return (
          <div
            className={`gap-item ${reached ? "is-reached" : ""}`}
            key={t.percent}
          >
            <div className="gap-label">
              <span>Top {t.percent}%</span>
              <strong>
                {t.cutoffUsd === null ? (
                  "Unavailable"
                ) : reached ? (
                  <>
                    <span aria-hidden="true">✓ </span>Reached
                  </>
                ) : (
                  usd(Math.max(0, t.cutoffUsd - value))
                )}
              </strong>
            </div>
            <div
              className="gap-track"
              role="progressbar"
              aria-label={`Progress to Top ${t.percent}% by ${unit}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <i style={{ width: progress + "%" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
