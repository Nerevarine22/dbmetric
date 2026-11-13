import fs from "node:fs";
import { loadEnvFile } from "node:process";
for (const file of [".env.local", "../.env", "../.env.local"])
  if (fs.existsSync(file)) loadEnvFile(file);
import { openDb, savePools, loadPools } from "./db";
import { syncPools } from "./apiSync";
import { indexChain } from "./indexer";
import { exportReport } from "./report";
import { CHAINS } from "./core";
import { backupDatabase } from "./snapshots";
import { acquireWriterLock } from "./lock";
import { indexLPChain } from "./lp/indexer";
import { valueLPChain } from "./lp/valuation";
import { valueLPFromEvents } from "./lp/replay";
const releaseLock = acquireWriterLock();
const db = openDb();
db.prepare(
  "UPDATE runs SET status='interrupted',completed_at=? WHERE status='running'",
).run(Math.floor(Date.now() / 1000));
if (process.argv.includes("--backup")) {
  console.log("Consistent SQLite backup:", await backupDatabase(db));
  db.close();
  process.exit(0);
}
if (process.argv.includes("--export-only")) {
  exportReport(db);
  db.close();
  process.exit(0);
}
const arg = process.argv.find((a) => a.startsWith("--days="))?.slice(7) ?? "1";
const days = arg === "all" ? "all" : Number(arg);
if (days !== "all" && (!Number.isFinite(days) || days <= 0))
  throw new Error("Use --days=1, --days=7 or --days=all");
const runId = Date.now();
db.prepare("INSERT INTO runs VALUES(?,?,?,?)").run(
  runId,
  Math.floor(runId / 1000),
  null,
  "running",
);
try {
  const fetched = await syncPools();
  savePools(db, fetched);
  const pools = loadPools(db);
  console.log(`Synced ${pools.length} pools from the canonical factory`);
  const results = await Promise.allSettled(
    CHAINS.map((c) => indexChain(db, pools, c, days)),
  );
  if (!process.argv.includes("--swaps-only")) {
    const lp = await Promise.allSettled(
      CHAINS.map(async (c) => {
        await indexLPChain(db, pools, c);
        if (c.id === 56 && !process.env.LP_RPC_56)
          await valueLPFromEvents(db, pools, c);
        else await valueLPChain(db, pools, c);
      }),
    );
    results.push(...lp);
  }
  const report = exportReport(db);
  const errors = results.filter((r) => r.status === "rejected");
  for (const result of errors)
    if (result.status === "rejected")
      console.error(
        String(result.reason).replaceAll(
          process.env.ENVIO_API_TOKEN ?? "__NONE__",
          "[redacted]",
        ),
      );
  db.prepare("UPDATE runs SET completed_at=?,status=? WHERE id=?").run(
    Math.floor(Date.now() / 1000),
    errors.length ? "partial" : "complete",
    runId,
  );
  console.log(
    `Report: public/analytics.json; indexed ${db.prepare("SELECT COUNT(*) n FROM swaps").get()?.n} swaps; ${report.poolCount} pools`,
  );
  if (errors.length) process.exitCode = 1;
} catch (e) {
  db.prepare("UPDATE runs SET completed_at=?,status=? WHERE id=?").run(
    Math.floor(Date.now() / 1000),
    "failed",
    runId,
  );
  if (loadPools(db).length) exportReport(db);
  throw e;
} finally {
  db.close();
  releaseLock();
}
