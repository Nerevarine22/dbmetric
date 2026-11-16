# Hourly Metric snapshot publisher

This task runs on the owner's Windows PC, in the existing checkout at `D:\Metric DB\metric-users`. Do not create a worktree: the ignored SQLite database and `.env` exist only in this checkout. The user authorizes hourly incremental scans and normal pushes of verified snapshot files to `https://github.com/Nerevarine22/dbmetric.git`, branch `main`.

Run **one command** from this checkout:

```powershell
npm run refresh:publish
```

The deterministic script handles locking, incremental swaps and LP scans, complete-coverage checks, all wallet-shard checksums/counts/listed ranks, checkpoint/archive consistency, freshness and regression checks, a daily rolling database backup, snapshot-only staging, credential checks, commits, normal pushes and remote SHA verification. It also recovers its own pending push after a transient network failure. It prints a small JSON result and saves detailed, token-redacted logs under `data/automation/`. Poll the same running command session at intervals of at most 60 seconds until it exits; do not launch a second command because the first one is quiet.

Success is `status: published` with a verified commit SHA. `unchanged` and `skipped` are harmless. On failure, read only the final JSON and at most the last 30 log lines. Report the specific issue and stop; let the next hourly run resume. Do not redesign the site, change code, install packages, spawn other agents, browse the web, run a full build, force-push, stash, reset, rebase, clear locks, rebuild history, or retry the scan repeatedly. Do not print `.env` or tokens. Do not stage or commit unrelated user changes, the database, backups, logs or credentials. Do not stop the local dev server. If a lock is held, leave the active process alone. If Git is dirty outside the snapshot files, or main diverges from origin/main, wait for user review.

The publisher commits only `ANALYSIS.md`, `public/analytics.json`, `public/snapshot-version.json` and hashed files under `public/wallets/`. Vercel's connected Git integration deploys these commits. The script verifies GitHub publication, not Vercel's deployment success; report that distinction accurately.

The snapshot version file lets visible browser tabs check once per minute and load the full analytics JSON only when a new version is available. Hidden tabs and open profile dialogs defer polling. A returning tab checks again. Browser polling does not call Envio.

The SQLite database, resumable block cursors, LP bin accumulators and private API token remain local. `data/automation/latest.sqlite` is replaced atomically at most once per UTC day; earlier manual backups are untouched. A failed scan never pushes partial results. A minimum of 12 GiB free space is required. Existing snapshot archives are retained, so monitor disk usage over time.

Model choice: use GPT-6 Luna with low reasoning. Keep each response short and use the script instead of analyzing the repository on every run. Do not promise a fixed token or money cost.

For local scheduled tasks, keep the computer powered on, awake, online and the Codex desktop app running. Existing public data remains accessible when this PC is offline, but new snapshots stop until local execution resumes.
