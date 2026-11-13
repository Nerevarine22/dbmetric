import fs from "node:fs";
import { loadEnvFile } from "node:process";
for (const p of [".env.local", "../.env", "../.env.local"])
  if (fs.existsSync(p)) loadEnvFile(p);
import { openDb, loadPools } from "../db";
import { acquireWriterLock } from "../lock";
import { CHAINS } from "../core";
import { indexLPChain } from "./indexer";
import { valueLPChain } from "./valuation";
import { exportReport } from "../report";
import { valueLPFromEvents } from "./replay";
const release = acquireWriterLock(),
  db = openDb();
try {
  const pools = loadPools(db);
  let failed = false;
  const requested = process.argv
    .find((a) => a.startsWith("--chain="))
    ?.slice(8);
  const selected = CHAINS.filter(
    (c) => !requested || c.id === Number(requested),
  );
  if (!selected.length) throw new Error("Unsupported LP chain");
  if (!process.argv.includes("--value-only")) {
    const results = await Promise.allSettled(
      selected.map((c) => indexLPChain(db, pools, c)),
    );
    for (const r of results)
      if (r.status === "rejected") {
        failed = true;
        console.error(
          String(r.reason).replaceAll(
            process.env.ENVIO_API_TOKEN || "__none__",
            "[redacted]",
          ),
        );
      }
  }
  if (!process.argv.includes("--index-only")) {
    const results = await Promise.allSettled(
      selected.map((c) =>
        process.argv.includes("--from-events") ||
        (c.id === 56 && !process.env.LP_RPC_56)
          ? valueLPFromEvents(db, pools, c)
          : valueLPChain(db, pools, c),
      ),
    );
    for (const r of results)
      if (r.status === "rejected") {
        failed = true;
        console.error(
          String(r.reason).replaceAll(
            process.env.ENVIO_API_TOKEN || "__none__",
            "[redacted]",
          ),
        );
      }
    if (!process.argv.includes("--no-export")) exportReport(db);
  }
  if (failed) process.exitCode = 1;
} finally {
  db.close();
  release();
}
