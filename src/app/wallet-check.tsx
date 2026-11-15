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
    timeZone: "Europe/Kyiv",
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
  useEffect(() => {
    if (current && !current.pending) heading.current?.focus();
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
    setValidation("");
    setInput(normalized);
    setAddress(normalized);
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
        <label id="wallet-check-label" htmlFor="wallet-address">
          Check any wallet
        </label>
        <div className="wallet-check-form">
          <input
            id="wallet-address"
            name="wallet"
            placeholder="Enter your wallet address · 0x…"
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
            {loading ? "Loading snapshot…" : "Check wallet ↗"}
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
          <span>
            Address only · No wallet connection needed · Snapshot data
          </span>
          {example && (
            <button
              type="button"
              onClick={() => {
                setInput(example);
                setAddress(example);
                setValidation("");
              }}
            >
              Try an indexed wallet →
            </button>
          )}
        </div>
        {!loading && !manifest && (
          <p className="wallet-check-error">
            Full wallet search is unavailable in this snapshot.{" "}
            <button type="button" onClick={onRefresh}>
              Refresh snapshot
            </button>
          </p>
        )}
      </form>
      {address && (
        <div className="wallet-result" aria-live="polite" aria-busy={pending}>
          <div className="wallet-result-heading">
            <div>
              <span className="eyebrow">
                YOUR METRIC PROFILE ·{" "}
                {network === "0"
                  ? "ALL NETWORKS"
                  : chains
                      .find((c) => String(c.id) === network)
                      ?.name.toUpperCase()}
              </span>
              <h2 ref={heading} tabIndex={-1}>
                Your wallet, in context.
              </h2>
              <p className="checked-address">{address}</p>
            </div>
            <button
              className="refresh"
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopyStatus("Link copied");
                } catch {
                  setCopyStatus(
                    "Copy the URL from your browser to share this profile.",
                  );
                }
              }}
            >
              Copy profile link
            </button>
          </div>
          {copyStatus && (
            <p className="wallet-check-help" role="status">
              {copyStatus}
            </p>
          )}
          {pending && (
            <p className="wallet-check-status">Checking indexed activity…</p>
          )}
          {current?.error && (
            <p className="notice error" role="alert">
              {current.error}{" "}
              <button className="refresh" onClick={onRefresh}>
                Refresh snapshot
              </button>
            </p>
          )}
          {current && !current.pending && !current.error && (
            <>
              {!entry && (
                <p className="wallet-check-status">
                  No indexed swap or LP activity found for this address on{" "}
                  {network === "0"
                    ? "the covered networks"
                    : chains.find((c) => String(c.id) === network)?.name}
                  . This describes the published snapshot; activity after its
                  cutoff is not included.
                </p>
              )}
              <div className="wallet-rank-grid">
                <article className="wallet-rank-card">
                  <div className="wallet-rank-top">
                    <span className="eyebrow">TRADING VOLUME</span>
                    <div className="periods" aria-label="Wallet volume period">
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
                  <strong className="wallet-rank-number">
                    {!row && period !== "all"
                      ? "No swaps in this window"
                      : tradeTitle}
                  </strong>
                  <p>
                    {trade?.rank
                      ? `of ${number(population?.totalWallets)} indexed traders`
                      : period === "all"
                        ? "Based on indexed transaction senders"
                        : "Activity is measured at the trading snapshot cutoff"}
                  </p>
                  {trade?.rank && (
                    <div className="wallet-rank-badges">
                      <span className="pill">
                        {rankCohort(trade.rank, population?.totalWallets ?? 0)}
                      </span>
                      <span>
                        {rankPosition(
                          trade.rank,
                          population?.totalWallets ?? 0,
                        )}
                      </span>
                    </div>
                  )}
                  {population && !population.windowComplete && (
                    <p className="wallet-check-error">
                      Partial indexed history. This rank covers the available
                      interval.
                    </p>
                  )}
                  <dl className="wallet-check-stats">
                    <Stat
                      label="Estimated swap volume"
                      value={
                        trade && trade.pricedSwaps === 0
                          ? "Unpriced"
                          : usd(trade?.volumeUsd ?? 0)
                      }
                    />
                    <Stat
                      label="Swap transactions"
                      value={number(trade?.transactions ?? 0)}
                    />
                    <Stat
                      label="Active days (UTC)"
                      value={number(trade?.activeDays ?? 0)}
                    />
                    <Stat
                      label="Pool swaps"
                      value={number(trade?.swaps ?? 0)}
                    />
                    <Stat
                      label="Pools traded"
                      value={number(trade?.pools ?? 0)}
                    />
                    <Stat
                      label="Pools created · lifetime"
                      value={number(
                        entry?.trading.all
                          ? readTrade(entry.trading.all).poolsCreated
                          : trade?.poolsCreated,
                      )}
                    />
                  </dl>
                  {trade && trade.pricedSwaps < trade.swaps && (
                    <p className="wallet-rank-note">
                      {number(trade.swaps - trade.pricedSwaps)} swaps lack a USD
                      estimate. Rank uses priced volume.
                    </p>
                  )}
                  {(!trade || trade.pricedSwaps > 0) && (
                    <Gaps
                      value={trade?.volumeUsd ?? 0}
                      thresholds={population?.cohorts}
                      unit="volume"
                    />
                  )}
                </article>
                <article className="wallet-rank-card">
                  <div className="wallet-rank-top">
                    <span className="eyebrow">ACTIVE LP LIQUIDITY</span>
                    <span className="wallet-rank-note">Snapshot holdings</span>
                  </div>
                  <strong className="wallet-rank-number">{lpTitle}</strong>
                  <p>
                    {lpRank
                      ? `of ${number(liquidity?.valuedActiveLPWallets)} USD-valued active LP wallets`
                      : "Position owner from liquidity events"}
                  </p>
                  {lpRank && (
                    <div className="wallet-rank-badges">
                      <span className="pill">{lp?.cohort}</span>
                      <span>
                        {rankPosition(
                          lpRank,
                          liquidity?.valuedActiveLPWallets ?? 0,
                        )}
                      </span>
                    </div>
                  )}
                  {liquidity && !liquidity.rankingComplete && (
                    <p className="wallet-check-error">
                      LP coverage or pricing is incomplete. Available ranks
                      describe the valued subset.
                    </p>
                  )}
                  <dl className="wallet-check-stats">
                    <Stat
                      label="Active LP value ≈"
                      value={
                        lp
                          ? usd(lp.activeUsd)
                          : liquidity?.historyComplete
                            ? usd(0)
                            : "Unavailable"
                      }
                    />
                    <Stat
                      label="Lifetime deposits ≈"
                      value={
                        lp
                          ? usd(lp.lifetimeDepositsUsd)
                          : liquidity?.historyComplete
                            ? usd(0)
                            : "Unavailable"
                      }
                    />
                    <Stat
                      label="Lifetime withdrawals ≈"
                      value={
                        lp
                          ? usd(lp.lifetimeWithdrawalsUsd)
                          : liquidity?.historyComplete
                            ? usd(0)
                            : "Unavailable"
                      }
                    />
                    <Stat
                      label="Open positions"
                      value={
                        lp
                          ? number(lp.openPositions)
                          : liquidity?.historyComplete
                            ? "0"
                            : "—"
                      }
                    />
                    <Stat
                      label="Active pools"
                      value={
                        lp
                          ? number(lp.activePools)
                          : liquidity?.historyComplete
                            ? "0"
                            : "—"
                      }
                    />
                    <Stat
                      label="LP transactions"
                      value={
                        lp
                          ? number(lp.lpTransactions)
                          : liquidity?.historyComplete
                            ? "0"
                            : "—"
                      }
                    />
                  </dl>
                  {liquidity?.historyComplete && lp?.activeUsd !== null && (
                    <Gaps
                      value={lp?.activeUsd ?? 0}
                      thresholds={liquidity?.thresholds}
                      unit="active liquidity"
                    />
                  )}
                </article>
              </div>
              <p className="wallet-rank-note">
                Trading snapshot:{" "}
                {trading ? date(trading.until) + " Kyiv" : "unavailable"}. LP
                snapshot:{" "}
                {liquidity?.asOf
                  ? date(liquidity.asOf) + " Kyiv"
                  : "unavailable"}
                ; <a href="#liquidity">individual chain cutoffs</a>. Cohorts
                round up and include ties. Network selection applies to both
                rankings; the volume period affects trading only.
              </p>
              <p className="wallet-rank-note">
                USD values are estimates. Historical deposits use synced spot
                quotes and can count repeated capital. Trader ranks identify
                transaction senders; LP ranks identify position owners, which
                can be strategy or custody contracts.
              </p>
              <div className="explorer-links">
                {chains
                  .filter((c) => network === "0" || String(c.id) === network)
                  .map((c) => (
                    <a
                      key={c.id}
                      href={`${c.explorer}/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.name} explorer ↗
                    </a>
                  ))}
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
      <span>Gap to cohort cutoff</span>
      {thresholds?.map((t) => (
        <div key={t.percent}>
          <span>Top {t.percent}%</span>
          <strong>
            {t.cutoffUsd === null
              ? "Unavailable"
              : value >= t.cutoffUsd
                ? "Reached"
                : `${usd(Math.max(0, t.cutoffUsd - value))} in ${unit}`}
          </strong>
        </div>
      ))}
    </div>
  );
}
