# Metric Trader Intelligence

An English-language Next.js dashboard for Metric Protocol traders and liquidity providers on Ethereum, BNB Chain and Robinhood Chain. It uses real pool metadata and indexed contract events, with no sample wallets or fabricated metrics.

## Run locally

The main feature is **Check any wallet**: paste an EVM address to see its exact volume and active-LP ranks, cohort, activity, deposits/withdrawals and gaps to Top 1% / 5% / 10%. Search covers every indexed wallet, including addresses outside the displayed top 1,000. Network selection applies to both rankings; All time / 24h / 7d changes only the wallet's trading rank. Profiles can be shared with `?wallet=0x...&network=0&walletPeriod=all`. No wallet connection or browser API token is required.

Each export streams the full SQL-ranked trader population and all LP profiles into address-prefix JSON shards under `public/wallets/`. The browser fetches only the shard for the selected address/network. Content hashes provide immutable caching and snapshot matching; unchanged data retains the same file names. Wallet lookups make no RPC or Envio requests. Missing activity, withdrawn LPs, missing prices and partial coverage have distinct states. USD ranks use estimated priced volume and fully valued positive LP portfolios, with separate denominators. The UI shows the indexed dates, rather than claiming live balances.

The interface follows Metric's graphite/cyan visual direction, with separate Wallet checker, Leaderboards and Insights views. A native SVG orbit, card entrances and milestone bars provide lightweight motion; all animation respects `prefers-reduced-motion`. Activity details and rank methodology expand on demand. The Metric mark comes from [metric.xyz](https://metric.xyz/metriclp_biglogo.svg); Space Grotesk is bundled locally under its included SIL Open Font License in `public/fonts/`.

Requires Node.js 24+.

```sh
npm ci
cp .env.example .env
# Set ENVIO_API_TOKEN in .env
npm run sync -- --days=all
npm run dev
```

Open http://localhost:3000. A checked-in `public/analytics.json` snapshot allows viewing the dashboard without an API token. The token is used by the separate CLI indexer and is never sent to the browser.

## Indexing and API economy

```sh
npm run sync                    # Continue from the saved block cursors
npm run sync -- --days=7         # Widen missing coverage to seven days, then resume normally
npm run sync -- --days=all       # Widen missing coverage to pool creation; does NOT rebuild an already complete history
npm run sync -- --export-only   # Recalculate the snapshot with zero API requests
npm run sync:watch -- --minutes=60
npm run backup                  # Consistent SQLite backup using the SQLite online backup API
```

The default first swap scan covers one day. LP history always starts at pool creation; BNB also backfills bin swaps once. Subsequent scans reuse the database and request blocks after the last committed cursor, plus a short finalized overlap. Repeated pages replace the same `(chain_id, tx_hash, log_index)` rows. A page and its cursor commit atomically; interruptions resume from the last committed page. The watcher runs scans sequentially. A PID lock prevents simultaneous CLI scans, exports and backups; an abandoned lock is recovered after its process exits. Use one writer per data directory.

New pools trigger a rewind to their creation block if it precedes the cursor. Metadata is paginated with `minTvlFiat=0` and filtered by the canonical factory. Previously registered pools remain in the local registry when a later API response omits them.

HyperSync uses its documented JSON API, avoiding native-client Windows binding issues. A slower public-RPC path is available without a token. HyperSync 429s use exponential backoff and Retry-After, capped at 30 seconds.

Requests are recorded in SQLite's `api_requests` with network, range, status and bytes. Tracking was added after the first backfill started; it covers subsequent scans, not earlier requests. Snapshot manifests include cumulative usage. Envio Free uses fair-use rate limits with no fixed published free requests-per-day guarantee. See [official pricing](https://envio.dev/pricing/hypersync).

## Saved data

| Location                                      | Contents                                                                      | Git       |
| --------------------------------------------- | ----------------------------------------------------------------------------- | --------- |
| `data/metric.sqlite`                          | Swaps, LP events/positions, bin accumulators, registry, cursors and API usage | Ignored   |
| `data/snapshots/<timestamp>-<hash>.json.gz`   | Immutable compressed analytics snapshot                                       | Ignored   |
| `data/checkpoints/<timestamp>.json`           | Cursors, registry, checksum and usage at export                               | Ignored   |
| `data/checkpoints/latest.json`                | Latest checkpoint manifest                                                    | Ignored   |
| `data/backups/*.sqlite`                       | Full consistent backups via `npm run backup`                                  | Ignored   |
| `public/analytics.json`                       | Latest browser-ready snapshot                                                 | Committed |
| `public/wallets/<chain>/<prefix>-<hash>.json` | Full-population wallet ranks and LP profiles, fetched by address prefix       | Committed |
| `ANALYSIS.md`                                 | Latest readable volume and concentration report                               | Committed |
| `.env`                                        | Private credentials                                                           | Ignored   |

Aggregate JSON is **not** a replacement for the raw database. Keep the database or a SQLite backup to resume without refetching history. Copy backups off the scanner machine for disaster recovery. Archived snapshots have timestamps and checksums and are not automatically deleted.

## Vercel

Import `Nerevarine22/dbmetric`, repository root, Next.js preset. `vercel.json` sets build `npm run build` and static output `out`. No database or HyperSync token is needed on Vercel.

The indexer runs on this computer or a server with a durable volume. Vercel serves the generated snapshot. Builds, page views and refreshes do not call HyperSync.

To publish new data initially:

```sh
npm run sync
git add public/analytics.json public/wallets ANALYSIS.md
git commit -m "Update Metric analytics snapshot"
git push origin main
```

Vercel's Git integration can deploy the commit. For updates without rebuilds, upload the snapshot **and its referenced wallet shards**, preserving their relative `wallets/` paths, to a persistent public object store with CORS and set `NEXT_PUBLIC_METRIC_SNAPSHOT_URL` at build time. Upload shards before replacing analytics.json. That upload and scanner require a persistent worker. This repository does not provision one or enable a cloud schedule. The local watcher is available when explicitly started.

Do not use a Vercel Function's local filesystem as a durable SQLite database. If indexing later moves to Vercel, migrate writes and checkpoints to external persistent storage and use bounded scan jobs. [Vercel filesystem documentation](https://vercel.com/docs/functions/runtimes#file-system-support).

## Metric definitions

- **Trader:** unique `tx.from`, deduplicated across chains. Not a count of people: bots, solvers, relayers and bundlers can represent other users.
- **Active:** at least one Swap within 24 hours / seven days of the indexed cutoff, not browser time. Partial windows are labeled.
- **Volume:** one token leg per pool Swap. Multi-pool routes can count several swaps per transaction. This is pool turnover, not deduplicated end-user notional, deposits or profit.
- **USD estimate:** allowlisted USDC/USDT quantity at $1; otherwise latest metadata spot price. Not historical execution prices. Depegs and price changes affect accuracy. Unpriced swaps count in activity and are excluded from volume.
- **Top 1%:** first `ceil(N / 100)` addresses by estimated volume, including cutoff ties. Tiny cohorts can exceed 1% of addresses.
- **All time:** only available after registered pools are indexed from creation. Networks share an indexed cutoff; all-time includes each network's own inception.
- **Leaderboard:** top 1,000 wallets per network/window for a compact public snapshot. Search, sorting and CSV export apply to listed rows. Aggregate metrics use all traders.
- **Refresh:** reloads the latest published JSON without triggering indexing.

## Liquidity providers

The **Top cohorts** comparison combines trading and LP metrics for the same Top 1% / 5% / 10% lifetime-volume-ranked trader addresses. It includes volume totals and medians, last-24h volume, unique swap transactions, UTC active days, pool creations and LP participation/deposits. Cohorts are nested and include ties. Medians describe cohort members; only the volume cutoff determines membership. LP medians across all traders include zero for known non-LPs, while LP-only medians state their subset. Unknown creator metadata or LP prices remain unavailable. The network filter applies; the leaderboard period does not redefine these lifetime groups.

The dashboard includes a separate active-LP leaderboard, Top 1% / 5% / 10% capital thresholds, cumulative deposits and withdrawals, and LP participation inside the lifetime top-trader volume cohorts.

```sh
npm run sync:lp                         # Index LP deltas, value positions and export
npm run sync:lp -- --index-only         # Only LiquidityAdded / LiquidityRemoved history
npm run sync:lp -- --value-only         # Reuse indexed LP history
npm run sync:lp -- --value-only --chain=56
npm run sync:lp -- --from-events --chain=1 # Optional event-replay valuation for another chain
npm run sync -- --swaps-only            # Skip the LP refresh
```

Normal `npm run sync` now updates swaps and LP data. Standalone LP commands target the existing finalized swap-index block for each chain. LP history has independent atomic checkpoints and starts at pool creation. The indexed LP owner is event.provider; indexed and legacy non-indexed uint80 salt layouts are supported.

**Ethereum and Robinhood:** pinned-block storage reads verify every open owner/salt/bin share balance, reconcile owner share supply with bin total shares, and reconcile bin reserves with pool slot1 totals. Multicall batches reduce HTTP calls and split if a provider rejects a large batch. An `LP_RPC_<chainId>` override can select an archive endpoint. Immutable scale multipliers and token/factory identity are verified from getImmutables().

**BNB default:** public archive storage access is restricted, so the scanner reconstructs bin reserves from LiquidityAdded, LiquidityRemoved and BinSwapped. BinSwapped deltas already include the retained LP fee; the fee is not added a second time. Immutable scales are verified through latest-state reads of the immutable contract parameters. Compact per-pool/bin accumulators commit atomically with each HyperSync cursor and finalized block hash. Restarting appends from those cursors; a hash mismatch triggers a replay of the affected prefix. Newly registered pools backfill separately. This requires a one-time BinSwapped history scan, after which only new events are fetched. Set LP_RPC_56 to opt into pinned archive storage reads instead.

Active LP USD is the current share of both token balances, using synced metadata quotes. Lifetime deposits and withdrawals are normalized native token flows repriced at those same quotes, **not historical execution USD or profit**. Adding and withdrawing the same capital repeatedly increases gross historical flows, while only remaining shares determine active capital.

Only fully priced positive active portfolios participate in LP capital cohorts. Missing prices, incomplete history and failed verification are disclosed; unpriced amounts are not silently treated as zero. Cross-chain views use each chain's disclosed block cutoff and show the earliest timestamp. Trader comparisons keep the trader snapshot's cutoff; the LP snapshot date is shown separately.

LP events, compact bin-swap deltas and coverage, raw open positions, pool verification status and valuation block hashes live in SQLite and its backups. JSON snapshots and checkpoint manifests retain the LP coverage and valuation provenance. Profitability remains outside scope.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

Tests cover signed packing, one-leg volume, missing prices, sender/router attribution, cross-chain deduplication, activity windows, SQL/reference parity, idempotent writes and cutoff ties. LP tests also cover both salt layouts, scaled two-token flows, partial exits, share/reserve reconciliation, bin-swap replay, stale valuation exclusion and trader-to-LP joins by owner. A live Ethereum cross-check matched event-replayed token amounts exactly to archive-storage-verified positions; a completed BNB replay made zero HyperSync calls on restart.

Primary references: [Metric contracts](https://github.com/Metricxyz/pool-contracts), [Metric public metadata](https://api.metric.xyz/public/v1/evm/metadata?chainIds=1,56,4663&minTvlFiat=0), [HyperSync query specification](https://docs.envio.dev/docs/HyperSync/hypersync-query).
