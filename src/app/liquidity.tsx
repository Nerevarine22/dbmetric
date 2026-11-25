"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { LPWallet } from "../lp/report";
export type LPScope = {
  asOf: number | null;
  historyComplete: boolean;
  rankingComplete: boolean;
  valuationComplete?: boolean;
  unpricedActiveLPWallets?: number;
  unverifiedActiveLPWallets?: number;
  totalLPWallets: number;
  activeLPWallets: number;
  valuedActiveLPWallets: number;
  unpricedOrUnverifiedWallets: number;
  failedPools: number;
  knownActiveLiquidityUsd: number;
  knownLifetimeDepositsUsd: number;
  knownLifetimeWithdrawalsUsd: number;
  thresholds: {
    percent: number;
    cutoffUsd: number | null;
    wallets: number;
    sharePct: number;
  }[];
  wallets: LPWallet[];
  traderCohorts: {
    percent: number;
    traderWallets: number;
    volumeCutoffUsd: number | null;
    lpEver: number;
    activeLPs: number;
    unpricedActiveLPs: number;
    totalKnownActiveUsd: number;
    medianActiveUsdAmongValuedLPs: number | null;
    medianLifetimeDepositsUsdAmongPricedLPs: number | null;
    medianLifetimeDepositsUsdAcrossAllTraders: number | null;
    medianActiveUsdAcrossAllTraders: number | null;
    traderAsOf: number;
  }[];
  traderWallets: Record<string, LPWallet | null>;
  chainCutoffs: {
    chainId: number;
    blockNumber: number;
    timestamp: number;
    blockHash: string;
  }[];
  quality: { storageVerifiedPools: number; eventReplayedPools: number };
};
const number = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);
const usd = (v: number | null) =>
  v === null
    ? "Unpriced"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(v);
const short = (s: string) => s.slice(0, 6) + "…" + s.slice(-4);
const when = (s: number) =>
  new Date(s * 1000).toLocaleString("en-GB", {
    timeZone: "UTC",
    timeZoneName: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
export function LiquiditySection({
  data,
  chains,
}: {
  data?: LPScope;
  chains: { id: number; name: string; explorer: string }[];
}) {
  const [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<LPWallet | null>(null);
  useEffect(() => {
    setPage(1);
    setSelected(null);
  }, [query, data]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLButtonElement>(".lp-modal .close")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "Tab") {
        const controls = [
          ...document.querySelectorAll<HTMLElement>(
            ".lp-modal button,.lp-modal a",
          ),
        ];
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
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [selected]);
  if (!data)
    return (
      <section className="panel lp-section" id="liquidity">
        <span className="eyebrow">04 / LIQUIDITY PROVIDERS</span>
        <h2>Active liquidity</h2>
        <p className="subtle">The LP snapshot has not been published yet.</p>
      </section>
    );
  const rows = data.wallets.filter((w) =>
    w.address.includes(query.trim().toLowerCase()),
  );
  return (
    <section className="lp-section" id="liquidity">
      <div className="lp-heading">
        <div>
          <span className="eyebrow">LP RANKINGS</span>
          <h2>Liquidity providers.</h2>
          <p>Ranked by active capital in pools.</p>
        </div>
        <span className="subtle">
          {data.asOf ? when(data.asOf) : "Awaiting valuation"}
        </span>
      </div>
      {(!data.historyComplete || !data.rankingComplete) && (
        <div className="notice" role="status">
          {!data.historyComplete
            ? "LP history or valuation is incomplete. "
            : "USD-valued portfolios only. "}
          {data.valuationComplete ? (
            <>{number(data.unpricedActiveLPWallets ?? 0)} active portfolios have
              missing token prices and are excluded from USD rankings. </>
          ) : (
            <>{number(data.unpricedOrUnverifiedWallets)} active portfolios excluded
              for missing prices or failed checks; {number(data.failedPools)} pools
              require verification. </>
          )}
          Rankings describe fully priced portfolios.
        </div>
      )}
      <div className="kpis">
        <LPMetric
          label="Valued active LP wallets"
          value={number(data.valuedActiveLPWallets)}
          note={`${number(data.activeLPWallets)} wallets have open bin shares`}
        />
        <LPMetric
          label="Known active liquidity ≈"
          value={usd(data.knownActiveLiquidityUsd)}
          note="Underlying tokens at the pinned chain blocks"
        />
        <LPMetric
          label="Lifetime deposits ≈"
          value={usd(data.knownLifetimeDepositsUsd)}
          note="Cumulative adds, repriced at synced spot quotes"
        />
        <LPMetric
          label="Lifetime withdrawals ≈"
          value={usd(data.knownLifetimeWithdrawalsUsd)}
          note="Cumulative removes; repeated capital is counted"
        />
      </div>
      <div className="lp-thresholds">
        {data.thresholds.map((t) => (
          <article className="panel" key={t.percent}>
            <span className="pill">TOP {t.percent}% LPs</span>
            <strong>
              {data.historyComplete ? usd(t.cutoffUsd) : "Incomplete"}
            </strong>
            <p>Active LP value entry cutoff</p>
            <div>
              {number(t.wallets)} valued wallets · {t.sharePct.toFixed(1)}% of
              valued capital
            </div>
          </article>
        ))}
      </div>
      <p className="lp-explainer">
        Entry thresholds among valued, active LP wallets.
      </p>
      <details className="lp-explainer">
        <summary>About LP rankings &amp; snapshot blocks</summary>
        <p>
          Ranks use positive, fully USD-valued active liquidity. Deposits and
          withdrawals are cumulative flows at synced quotes; they do not
          determine rank. Each network uses its disclosed block cutoff.
        </p>
        <p>
          {number(data.quality.storageVerifiedPools)} pools checked against
          contract storage · {number(data.quality.eventReplayedPools)} pools
          reconstructed from complete LP and bin-swap history.
        </p>
        {data.chainCutoffs.map((c) => (
          <p key={c.chainId}>
            {chains.find((chain) => chain.id === c.chainId)?.name}:{" "}
            <a
              href={`${chains.find((chain) => chain.id === c.chainId)?.explorer}/block/${c.blockNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              block {number(c.blockNumber)} ↗
            </a>{" "}
            · {when(c.timestamp)}
          </p>
        ))}
      </details>
      <article className="panel leaderboard lp-leaderboard">
        <div className="table-heading">
          <div>
            <span className="eyebrow">LP LEADERBOARD</span>
            <h2>Providers by active liquidity</h2>
          </div>
          <span className="subtle">
            {number(data.totalLPWallets)} historical LP owners
          </span>
        </div>
        <div className="table-controls">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search LP wallets"
              placeholder="Search LP address 0x…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <p className="listing-note">
          Top {number(data.wallets.length)} valued portfolios ·{" "}
          {number(data.totalLPWallets)} historical LP owners.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>LP wallet / cohort</th>
                <th className="numeric">Active liquidity ≈</th>
                <th className="numeric">Lifetime deposits ≈</th>
                <th className="numeric">Withdrawals ≈</th>
                <th className="numeric">Open positions</th>
                <th className="numeric">Pools</th>
                <th className="numeric">LP transactions</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice((page - 1) * 20, page * 20).map((w) => (
                <tr key={w.address}>
                  <td>{w.rank}</td>
                  <td>
                    <button
                      className="wallet-link"
                      onClick={() => setSelected(w)}
                    >
                      {short(w.address)}
                    </button>
                    {w.cohort !== "Rest" && (
                      <span className="cohort">{w.cohort.toUpperCase()}</span>
                    )}
                  </td>
                  <td className="numeric volume-cell">{usd(w.activeUsd)}</td>
                  <td className="numeric">{usd(w.lifetimeDepositsUsd)}</td>
                  <td className="numeric">{usd(w.lifetimeWithdrawalsUsd)}</td>
                  <td className="numeric">{number(w.openPositions)}</td>
                  <td className="numeric">{number(w.activePools)}</td>
                  <td className="numeric">{number(w.lpTransactions)}</td>
                  <td>
                    <button
                      className="open-wallet"
                      onClick={() => setSelected(w)}
                      aria-label={"LP profile " + w.address}
                    >
                      ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <p className="empty">No valued LP wallet matches this search.</p>
        )}
        <div className="pagination">
          <span>
            {rows.length
              ? `${(page - 1) * 20 + 1}–${Math.min(page * 20, rows.length)} of ${number(rows.length)}`
              : "0"}{" "}
            listed LP wallets
          </span>
          <div>
            <button
              aria-label="Previous LP page"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ←
            </button>
            <span>
              {page} / {Math.max(1, Math.ceil(rows.length / 20))}
            </span>
            <button
              aria-label="Next LP page"
              disabled={page * 20 >= rows.length}
              onClick={() => setPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        </div>
      </article>
      {selected && createPortal(
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="wallet-modal lp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              aria-label="Close LP profile"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <span className="eyebrow">
              LIQUIDITY PROVIDER / {selected.cohort.toUpperCase()}
            </span>
            <h2 id="lp-title">LP #{selected.rank}</h2>
            <p className="full-address">{selected.address}</p>
            <div className="profile-stats">
              <div>
                <span>Active LP value ≈</span>
                <strong>{usd(selected.activeUsd)}</strong>
              </div>
              <div>
                <span>Lifetime deposits ≈</span>
                <strong>{usd(selected.lifetimeDepositsUsd)}</strong>
              </div>
              <div>
                <span>Lifetime withdrawals ≈</span>
                <strong>{usd(selected.lifetimeWithdrawalsUsd)}</strong>
              </div>
              <div>
                <span>Open positions / bins</span>
                <strong>
                  {selected.openPositions} / {selected.openBinPositions}
                </strong>
              </div>
              <div>
                <span>LP transactions</span>
                <strong>{number(selected.lpTransactions)}</strong>
              </div>
              <div>
                <span>LP active days (UTC)</span>
                <strong>{selected.activeDays}</strong>
              </div>
            </div>
            <p className="profile-note">
              {selected.depositCount} adds · {selected.withdrawalCount} removes
              <br />
              Last LP action: {when(selected.lastActive)}
            </p>
            <div className="explorer-links">
              {selected.chains.map((id) => (
                <a
                  key={id}
                  href={
                    (chains.find((c) => c.id === id)?.explorer ?? "") +
                    "/address/" +
                    selected.address
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {chains.find((c) => c.id === id)?.name} ↗
                </a>
              ))}
            </div>
            <p className="disclaimer">
              Both token legs are valued. Historical flows use synced spot
              prices, not historical execution USD. Repeated deposits count the
              same capital again; net flows do not establish profit.
            </p>
          </section>
        </div>,
        document.body,
      )}
    </section>
  );
}
function LPMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="metric">
      <div className="metric-label">{label}</div>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}
