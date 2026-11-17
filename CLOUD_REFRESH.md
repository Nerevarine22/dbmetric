# Cloud snapshot updates

The public repository runs `.github/workflows/refresh.yml` on GitHub's standard Ubuntu runner at minute 17 of every hour (UTC). GitHub can delay scheduled runs. Use **Actions → Refresh Metric snapshot → Run workflow** for a manual update. The PC and Codex do not need to be running; the job makes no AI calls.

Standard GitHub-hosted runners are free for public repositories. This setup uses no paid server, Actions artifact storage or database service. Keep this repository public. GitHub and Envio service limits still apply; the scanner uses the existing Envio token and resumes from committed block cursors instead of fetching all history again.

## Credentials and database

Store `ENVIO_API_TOKEN` in the repository's **Settings → Secrets and variables → Actions**. The built-in `GITHUB_TOKEN` gets `contents: write` for snapshot commits and checkpoint uploads. Do not commit `.env`, tokens or the raw database to Git history.

The `metric-state` prerelease contains the approved **public onchain SQLite database**, compressed into 512 MiB release assets. The manifest records SHA-256 hashes of every part and the uncompressed database. A manifest is published last, after all parts; interrupted uploads cannot become recovery points. Restore validates checksums and SQLite integrity and stops if there is no seed. It never silently rebuilds from zero. Two complete versions are retained; older checkpoint assets are removed only after a new one is complete.

For the first migration, finish any one-time event backfill, then run `npm run cloud:save` from the local checkout with Node 24. Local access uses the configured GitHub credential; hosted jobs use their built-in token. The backup refuses to upload a database containing either active credential. An existing database is never overwritten by `cloud:restore`.

## Publication and recovery

Each job restores the newest complete checkpoint, runs `npm run refresh:publish`, and saves the resulting database even when the scan fails, preserving incremental progress. A failed or partial scan never publishes website JSON. Jobs are serialized so scans and checkpoint rotation cannot overlap. Hosted jobs skip the extra local daily SQLite copy to fit runner disk space.

BNB and Robinhood reconstruct LP positions from indexed liquidity and BinSwapped events by default. Ethereum uses storage verification. Set `LP_RPC_<chainId>` only to explicitly select a reliable archive RPC. Event replay avoids Robinhood's intermittent historical-state RPC errors; only its first backfill reads old swap-bin history.

The publisher validates complete coverage, LP valuation heads, wallet shard checksums, snapshot age and regression checks before pushing generated JSON to `main`. Vercel's Git integration then deploys the commit. Public browser tabs check the tiny version file once a minute; they do not call Envio.

Inspect Actions run logs on failure and use Run workflow to resume. Do not delete the release or secret: they are required for independent cloud operation. Failed uploads may leave unreferenced parts; those are not recovery points and can be removed after confirming the two retained manifests. The former Codex hourly task should remain disabled once the first hosted run succeeds.
