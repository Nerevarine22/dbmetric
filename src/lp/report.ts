import type { DatabaseSync } from "node:sqlite";
import { CHAINS, type Pool } from "../core";
import { valueLPEvent, type LPEvent, type LPConfig } from "./core";
import { scaledValue } from "./valuation";
export type LPWallet = {
  address: string;
  activeUsd: number | null;
  knownActiveUsd: number;
  lifetimeDepositsUsd: number | null;
  lifetimeWithdrawalsUsd: number | null;
  knownDepositsUsd: number;
  knownWithdrawalsUsd: number;
  depositCount: number;
  withdrawalCount: number;
  lpTransactions: number;
  activeDays: number;
  openBinPositions: number;
  openPositions: number;
  activePools: number;
  chains: number[];
  firstSeen: number;
  lastActive: number;
  missingCurrentPositions: number;
  unpricedEvents: number;
  rank: number | null;
  cohort: string;
  sharePct: number;
};
type Working = LPWallet & {
  tx: Set<string>;
  days: Set<number>;
  pools: Set<string>;
  positions: Set<string>;
  chainSet: Set<number>;
  missingAdds: number;
  missingRemoves: number;
};
export function lpCutoffs(wallets: LPWallet[]) {
  const ranked = wallets
    .filter((w) => w.activeUsd !== null && w.activeUsd > 0)
    .sort(
      (a, b) =>
        b.activeUsd! - a.activeUsd! || a.address.localeCompare(b.address),
    );
  const total = ranked.reduce((n, w) => n + w.activeUsd!, 0);
  let rank = 1;
  ranked.forEach((w, i) => {
    if (i > 0 && w.activeUsd !== ranked[i - 1].activeUsd) rank = i + 1;
    w.rank = rank;
    w.sharePct = total ? (100 * w.activeUsd!) / total : 0;
    w.cohort =
      rank <= Math.ceil(ranked.length / 100)
        ? "Top 1%"
        : rank <= Math.ceil(ranked.length * 0.05)
          ? "Top 5%"
          : rank <= Math.ceil(ranked.length * 0.1)
            ? "Top 10%"
            : "Rest";
  });
  return {
    ranked,
    thresholds: [1, 5, 10].map((percent) => {
      const cutoff = ranked.length
        ? ranked[Math.ceil((ranked.length * percent) / 100) - 1].activeUsd
        : null;
      const cohort =
        cutoff === null ? [] : ranked.filter((w) => w.activeUsd! >= cutoff);
      return {
        percent,
        cutoffUsd: cutoff,
        wallets: cohort.length,
        sharePct: total
          ? (100 * cohort.reduce((n, w) => n + w.activeUsd!, 0)) / total
          : 0,
      };
    }),
  };
}
const median = (a: number[]) => {
  if (!a.length) return null;
  const b = [...a].sort((a, b) => a - b);
  return (
    (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2
  );
};
function wallet(address: string): Working {
  return {
    address,
    activeUsd: 0,
    knownActiveUsd: 0,
    lifetimeDepositsUsd: 0,
    lifetimeWithdrawalsUsd: 0,
    knownDepositsUsd: 0,
    knownWithdrawalsUsd: 0,
    depositCount: 0,
    withdrawalCount: 0,
    lpTransactions: 0,
    activeDays: 0,
    openBinPositions: 0,
    openPositions: 0,
    activePools: 0,
    chains: [],
    firstSeen: Infinity,
    lastActive: 0,
    missingCurrentPositions: 0,
    unpricedEvents: 0,
    rank: null,
    cohort: "Inactive",
    sharePct: 0,
    tx: new Set(),
    days: new Set(),
    pools: new Set(),
    positions: new Set(),
    chainSet: new Set(),
    missingAdds: 0,
    missingRemoves: 0,
  };
}
export function buildLPReport(
  db: DatabaseSync,
  pools: Pool[],
  traderScopes: Record<string, unknown>,
  exportWallets?: (chainId: number, wallets: LPWallet[]) => void,
) {
  const coverage = db
    .prepare("SELECT * FROM lp_coverage ORDER BY chain_id")
    .all();
  const heads = db
    .prepare("SELECT * FROM lp_valuation_heads ORDER BY chain_id")
    .all();
  const poolStates = db.prepare("SELECT * FROM lp_pool_valuations").all();
  const configs = new Map(
    db
      .prepare("SELECT * FROM lp_configs")
      .all()
      .filter((c) => c.factor0 && c.factor1)
      .map((c) => [
        `${c.chain_id}:${c.pool_address}`,
        { factor0: String(c.factor0), factor1: String(c.factor1) } as LPConfig,
      ]),
  );
  const poolMap = new Map(
    pools.map((p) => [`${p.chainId}:${p.poolAddress}`, p]),
  );
  const events = [
    ...db.prepare("SELECT data FROM lp_events ORDER BY timestamp").iterate(),
  ].map((r) => JSON.parse(String(r.data)) as LPEvent);
  const positions = db.prepare("SELECT * FROM lp_positions").all();
  const scopes: Record<string, unknown> = {};
  for (const chainId of [0, ...CHAINS.map((c) => c.id)]) {
    const relevantHeads = heads.filter(
      (h) => !chainId || h.chain_id === chainId,
    );
    const headMap = new Map(
      relevantHeads.map((h) => [Number(h.chain_id), Number(h.block_number)]),
    );
    const expectedPools = pools.filter(
      (p) =>
        (!chainId || p.chainId === chainId) &&
        p.createdBlockNumber <= (headMap.get(p.chainId) ?? -1),
    );
    const valuationMap = new Map(
      poolStates.map((p) => [`${p.chain_id}:${p.pool_address}`, p]),
    );
    const validPool = (key: string, chain: number) => {
      const state = valuationMap.get(key);
      return (
        state &&
        ["verified", "replayed"].includes(String(state.status)) &&
        !state.error &&
        Number(state.block_number) === headMap.get(chain)
      );
    };
    const owners = new Map<string, Working>();
    const unverifiedOwners = new Set<string>();
    const get = (a: string) => {
      if (!owners.has(a)) owners.set(a, wallet(a));
      return owners.get(a)!;
    };
    for (const e of events) {
      if (
        (chainId && e.chainId !== chainId) ||
        e.blockNumber > (headMap.get(e.chainId) ?? -1)
      )
        continue;
      const w = get(e.owner);
      const p = poolMap.get(`${e.chainId}:${e.poolAddress}`),
        config = configs.get(`${e.chainId}:${e.poolAddress}`);
      const value = p && config ? valueLPEvent(e, p, config) : null;
      w.chainSet.add(e.chainId);
      w.tx.add(`${e.chainId}:${e.txHash}`);
      w.days.add(Math.floor(e.timestamp / 86400));
      w.firstSeen = Math.min(w.firstSeen, e.timestamp);
      w.lastActive = Math.max(w.lastActive, e.timestamp);
      if (value === null) w.unpricedEvents++;
      if (e.action === "ADD") {
        w.depositCount++;
        if (value === null) w.missingAdds++;
        else w.knownDepositsUsd += value;
      } else {
        w.withdrawalCount++;
        if (value === null) w.missingRemoves++;
        else w.knownWithdrawalsUsd += value;
      }
    }
    for (const p of positions) {
      if (chainId && p.chain_id !== chainId) continue;
      if (!headMap.has(Number(p.chain_id))) continue;
      const w = get(String(p.owner));
      w.chainSet.add(Number(p.chain_id));
      w.pools.add(`${p.chain_id}:${p.pool_address}`);
      w.positions.add(`${p.chain_id}:${p.pool_address}:${p.salt}`);
      w.openBinPositions++;
      const pool = poolMap.get(`${p.chain_id}:${p.pool_address}`),
        config = configs.get(`${p.chain_id}:${p.pool_address}`);
      const verified = Boolean(
        validPool(`${p.chain_id}:${p.pool_address}`, Number(p.chain_id)) &&
        !p.error &&
        p.amount0_scaled !== null &&
        p.amount1_scaled !== null &&
        BigInt(String(p.amount0_scaled)) >= 0n && BigInt(String(p.amount1_scaled)) >= 0n &&
        BigInt(String(p.shares)) > 0n &&
        pool &&
        config && BigInt(config.factor0) > 0n && BigInt(config.factor1) > 0n,
      );
      const value = verified
        ? scaledValue(pool!, BigInt(String(p.amount0_scaled)), BigInt(String(p.amount1_scaled)), config!)
        : null;
      if (value === null) {
        w.missingCurrentPositions++;
        const missingQuote = verified && [
          [p.amount0_scaled, pool!.token0FiatPrice],
          [p.amount1_scaled, pool!.token1FiatPrice],
        ].some(([amount, price]) => BigInt(String(amount)) !== 0n &&
          (price === null || !Number.isFinite(price) || Number(price) <= 0));
        // Missing quotes can exclude a verified portfolio from USD ranks.
        // Missing balances, configs, stale heads and numeric failures cannot.
        if (!missingQuote) unverifiedOwners.add(w.address);
      }
      else w.knownActiveUsd += value;
    }
    const all: LPWallet[] = [...owners.values()].map((w) => {
      const {
        tx,
        days,
        pools: heldPools,
        positions: heldPositions,
        chainSet,
        missingAdds,
        missingRemoves,
        ...rest
      } = w;
      return {
        ...rest,
        activeUsd: w.missingCurrentPositions ? null : w.knownActiveUsd,
        lifetimeDepositsUsd: missingAdds ? null : w.knownDepositsUsd,
        lifetimeWithdrawalsUsd: missingRemoves ? null : w.knownWithdrawalsUsd,
        lpTransactions: tx.size,
        activeDays: days.size,
        activePools: heldPools.size,
        openPositions: heldPositions.size,
        chains: [...chainSet],
        firstSeen: Number.isFinite(w.firstSeen) ? w.firstSeen : 0,
      };
    });
    const byOwner = new Map(all.map((w) => [w.address, w]));
    const { ranked, thresholds } = lpCutoffs(all);
    exportWallets?.(chainId, all);
    const expectedChains = chainId ? 1 : CHAINS.length;
    const historyComplete =
      coverage.filter((c) => !chainId || c.chain_id === chainId).length ===
        expectedChains &&
      coverage
        .filter((c) => !chainId || c.chain_id === chainId)
        .every(
          (c) =>
            c.status === "complete" &&
            Number(c.from_block) <= Number(c.genesis_block) &&
            Number(c.to_block) === (headMap.get(Number(c.chain_id)) ?? -1) &&
            pools
              .filter(
                (p) =>
                  p.chainId === Number(c.chain_id) &&
                  p.createdBlockNumber <= Number(c.to_block),
              )
              .every((p) =>
                (JSON.parse(String(c.registry_json)) as string[]).includes(
                  p.poolAddress,
                ),
              ),
        );
    const failures = expectedPools
      .filter((p) => !validPool(`${p.chainId}:${p.poolAddress}`, p.chainId))
      .map((p) => ({
        pool_address: p.poolAddress,
        error:
          valuationMap.get(`${p.chainId}:${p.poolAddress}`)?.error ??
          "Missing or stale pool valuation",
      }));
    const unknown = all.filter((w) => w.missingCurrentPositions > 0);
    const unverified = unknown.filter((w) => unverifiedOwners.has(w.address));
    const unpriced = unknown.length - unverified.length;
    const traderScope = traderScopes[String(chainId)] as
      | {
          until: number;
          windows: {
            all: {
              totalWallets: number;
              cohorts?: {
                percent: number;
                cutoffUsd: number | null;
                wallets: number;
              }[];
            };
          };
        }
      | undefined;
    const traderCohorts: unknown[] = [];
    if (traderScope?.windows.all.cohorts && all.length) {
      const addresses = all.map((w) => w.address);
      const volumeByLP = new Map<string, number>();
      // The covering index avoids random table reads for active high-frequency traders.
      const rows = db
        .prepare(
          `SELECT trader,SUM(COALESCE(volume_usd,0)) volume FROM swaps INDEXED BY swaps_analytics_cover WHERE timestamp<=? ${chainId ? "AND chain_id=?" : ""} AND trader IN (${addresses.map(() => "?").join(",")}) GROUP BY trader`,
        )
        .all(traderScope.until, ...(chainId ? [chainId] : []), ...addresses);
      for (const r of rows) volumeByLP.set(String(r.trader), Number(r.volume));
      for (const c of traderScope.windows.all.cohorts) {
        const members =
          c.cutoffUsd === null
            ? []
            : all.filter(
                (w) => (volumeByLP.get(w.address) ?? -1) >= c.cutoffUsd!,
              );
        const active = members.filter((w) => w.openBinPositions > 0);
        const valued = active.filter((w) => w.activeUsd !== null);
        const noLP = c.wallets - members.length;
        const knownZero =
          noLP + members.filter((w) => w.activeUsd === 0).length;
        traderCohorts.push({
          percent: c.percent,
          traderWallets: c.wallets,
          volumeCutoffUsd: c.cutoffUsd,
          lpEver: members.length,
          activeLPs: active.length,
          unpricedActiveLPs: active.length - valued.length,
          totalKnownActiveUsd: active.reduce((n, w) => n + w.knownActiveUsd, 0),
          medianActiveUsdAmongValuedLPs: median(
            valued.map((w) => w.activeUsd!),
          ),
          medianLifetimeDepositsUsdAmongPricedLPs: median(
            members
              .filter((w) => w.lifetimeDepositsUsd !== null)
              .map((w) => w.lifetimeDepositsUsd!),
          ),
          medianLifetimeDepositsUsdAcrossAllTraders:
            !historyComplete ||
            members.some((w) => w.lifetimeDepositsUsd === null)
              ? null
              : median([
                  ...Array(Math.max(0, noLP)).fill(0),
                  ...members.map((w) => w.lifetimeDepositsUsd!),
                ]),
          medianActiveUsdAcrossAllTraders: !historyComplete
            ? null
            : knownZero > c.wallets / 2
              ? 0
              : active.some((w) => w.activeUsd === null)
                ? null
                : median([
                    ...Array(noLP).fill(0),
                    ...members.map((w) => w.activeUsd!),
                  ]),
          traderAsOf: traderScope.until,
        });
      }
    }
    scopes[chainId] = {
      chainCutoffs: relevantHeads.map((h) => ({
        chainId: Number(h.chain_id),
        blockNumber: Number(h.block_number),
        timestamp: Number(h.timestamp),
        blockHash: String(h.block_hash),
      })),
      asOf: relevantHeads.length
        ? Math.min(...relevantHeads.map((h) => Number(h.timestamp)))
        : null,
      historyComplete,
      valuationComplete: historyComplete && failures.length === 0 && unverified.length === 0,
      rankingComplete:
        historyComplete && failures.length === 0 && unknown.length === 0,
      totalLPWallets: all.length,
      activeLPWallets: all.filter((w) => w.openBinPositions > 0).length,
      valuedActiveLPWallets: ranked.length,
      unpricedOrUnverifiedWallets: unknown.length,
      unpricedActiveLPWallets: unpriced,
      unverifiedActiveLPWallets: unverified.length,
      failedPools: failures.length,
      knownActiveLiquidityUsd: all.reduce((n, w) => n + w.knownActiveUsd, 0),
      knownLifetimeDepositsUsd: all.reduce((n, w) => n + w.knownDepositsUsd, 0),
      knownLifetimeWithdrawalsUsd: all.reduce(
        (n, w) => n + w.knownWithdrawalsUsd,
        0,
      ),
      thresholds,
      wallets: ranked.slice(0, 1000),
      traderCohorts,
      traderWallets: Object.fromEntries(
        Object.values(
          (
            traderScopes[String(chainId)] as
              | { windows: Record<string, { wallets: { address: string }[] }> }
              | undefined
          )?.windows ?? {},
        )
          .flatMap((w) => w.wallets)
          .map((w) => [w.address, byOwner.get(w.address) ?? null]),
      ),
      quality: {
        storageVerifiedPools: poolStates.filter(
          (p) =>
            (!chainId || p.chain_id === chainId) && p.status === "verified",
        ).length,
        eventReplayedPools: poolStates.filter(
          (p) =>
            (!chainId || p.chain_id === chainId) && p.status === "replayed",
        ).length,
        excludedWallets: unknown.slice(0, 100).map((w) => ({
          address: w.address,
          missingPositions: w.missingCurrentPositions,
          reason: unverifiedOwners.has(w.address) ? "unverified" : "missing-price",
        })),
        poolErrors: failures.map((p) => ({
          poolAddress: p.pool_address,
          error: p.error,
        })),
      },
    };
  }
  return {
    coverage,
    valuationHeads: heads,
    binSwapCoverage: db
      .prepare(
        "SELECT chain_id,MIN(to_block) through_block,SUM(event_count) events,COUNT(*) pools FROM lp_bin_coverage GROUP BY chain_id",
      )
      .all(),
    scopes,
    methodology: {
      owner: "LP position owner from event.provider, not transaction sender.",
      activeLiquidity:
        "Position shares / bin total shares times scaled reserves at pinned blocks. Ethereum defaults to storage reconciliation. BNB and Robinhood default to replaying LiquidityAdded/Removed and BinSwapped from pool creation, with atomic bin accumulators and finalized-block hash guards. Archive RPC overrides select storage reconciliation. Each valuation source is disclosed.",
      ranking:
        "Top 1/5/10% among fully USD-valued, positive active LP portfolios. Unpriced or unverifiable active portfolios are excluded and disclosed. This is a separate population from trader-volume rankings.",
      deposits:
        "Cumulative adds and removals, both token legs, normalized with verified immutable scale multipliers. USD cash flows are repriced using latest synced metadata quotes; these are not historical execution USD and are not profit.",
      coverage:
        "Each chain is valued at its own finalized indexed block. Cross-chain snapshot timestamp is the earliest chain timestamp; individual block cutoffs are provided. Trader comparisons retain the trading snapshot cutoff.",
    },
  };
}
