# Metric Trader Intelligence

An English-language Next.js dashboard for Metric Protocol trader activity on Ethereum, BNB Chain and Robinhood Chain. It uses real pool metadata and indexed Swap events, with no sample wallets or fabricated metrics.

## Run locally

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

The default first scan covers one day. Subsequent scans reuse the database and request blocks after the last committed cursor, plus a short finalized overlap. Repeated pages replace the same `(chain_id, tx_hash, log_index)` rows. A page and its cursor commit atomically; interruptions resume from the last committed page. The watcher runs scans sequentially. Use one writer per data directory; do not run manual scans alongside the watcher.

New pools trigger a rewind to their creation block if it precedes the cursor. Metadata is paginated with `minTvlFiat=0` and filtered by the canonical factory. Previously registered pools remain in the local registry when a later API response omits them.

HyperSync uses its documented JSON API, avoiding native-client Windows binding issues. A slower public-RPC path is available without a token. HyperSync 429s use exponential backoff and Retry-After, capped at 30 seconds.

Requests are recorded in SQLite's `api_requests` with network, range, status and bytes. Tracking was added after the first backfill started; it covers subsequent scans, not earlier requests. Snapshot manifests include cumulative usage. Envio Free uses fair-use rate limits with no fixed published free requests-per-day guarantee. See [official pricing](https://envio.dev/pricing/hypersync).

## Saved data

| Location                                    | Contents                                                  | Git       |
| ------------------------------------------- | --------------------------------------------------------- | --------- |
| `data/metric.sqlite`                        | Decoded swaps, pool registry, cursors, runs and API usage | Ignored   |
| `data/snapshots/<timestamp>-<hash>.json.gz` | Immutable compressed analytics snapshot                   | Ignored   |
| `data/checkpoints/<timestamp>.json`         | Cursors, registry, checksum and usage at export           | Ignored   |
| `data/checkpoints/latest.json`              | Latest checkpoint manifest                                | Ignored   |
| `data/backups/*.sqlite`                     | Full consistent backups via `npm run backup`              | Ignored   |
| `public/analytics.json`                     | Latest browser-ready snapshot                             | Committed |
| `.env`                                      | Private credentials                                       | Ignored   |

Aggregate JSON is **not** a replacement for the raw database. Keep the database or a SQLite backup to resume without refetching history. Copy backups off the scanner machine for disaster recovery. Archived snapshots have timestamps and checksums and are not automatically deleted.

## Vercel

Import `Nerevarine22/dbmetric`, repository root, Next.js preset. `vercel.json` sets build `npm run build` and static output `out`. No database or HyperSync token is needed on Vercel.

The indexer runs on this computer or a server with a durable volume. Vercel serves the generated snapshot. Builds, page views and refreshes do not call HyperSync.

To publish new data initially:

```sh
npm run sync
git add public/analytics.json
git commit -m "Update Metric analytics snapshot"
git push origin main
```

Vercel's Git integration can deploy the commit. For updates without rebuilds, upload the snapshot to a persistent public object store with CORS and set `NEXT_PUBLIC_METRIC_SNAPSHOT_URL` at build time. That upload and scanner require a persistent worker. This repository does not provision one or enable a cloud schedule. The local watcher is available when explicitly started.

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

LP TVL, LP users and profitability are outside this first release.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

Tests cover signed packing, one-leg volume, missing prices, sender/router attribution, cross-chain deduplication, activity windows, SQL/reference parity, idempotent writes and cutoff ties.

Primary references: [Metric contracts](https://github.com/Metricxyz/pool-contracts), [Metric public metadata](https://api.metric.xyz/public/v1/evm/metadata?chainIds=1,56,4663&minTvlFiat=0), [HyperSync query specification](https://docs.envio.dev/docs/HyperSync/hypersync-query).
