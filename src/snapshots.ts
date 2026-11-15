import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { backup, type DatabaseSync } from "node:sqlite";
function atomic(file: string, data: string | Buffer) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
}
export function archiveSnapshot(
  db: DatabaseSync,
  report: { generatedAt: number; coverage: unknown; [key: string]: unknown },
  directory = "data",
) {
  const id = new Date(report.generatedAt * 1000)
    .toISOString()
    .replaceAll(":", "-");
  const json = JSON.stringify(report);
  const checksum = createHash("sha256").update(json).digest("hex");
  const file = path.join(
    directory,
    "snapshots",
    `${id}-${checksum.slice(0, 8)}.json.gz`,
  );
  atomic(file, gzipSync(json));
  const checkpoint = {
    schemaVersion: 1,
    snapshotId: id,
    generatedAt: report.generatedAt,
    sha256: checksum,
    snapshotFile: file,
    databaseFile: "data/metric.sqlite",
    coverage: report.coverage,
    walletLookup: report.walletLookup,
    liquidityCoverage: (report.liquidity as { coverage?: unknown } | undefined)
      ?.coverage,
    liquidityValuationHeads: (
      report.liquidity as { valuationHeads?: unknown } | undefined
    )?.valuationHeads,
    liquidityBinSwapCoverage: (
      report.liquidity as { binSwapCoverage?: unknown } | undefined
    )?.binSwapCoverage,
    poolRegistry: db
      .prepare("SELECT chain_id,address FROM pools ORDER BY chain_id,address")
      .all(),
    usage: db
      .prepare(
        "SELECT chain_id,COUNT(*) requests,SUM(status=429) rateLimited,SUM(bytes) responseBytes FROM api_requests GROUP BY chain_id",
      )
      .all(),
  };
  atomic(
    path.join(directory, "checkpoints", "latest.json"),
    JSON.stringify(checkpoint, null, 2),
  );
  atomic(
    path.join(directory, "checkpoints", `${id}-${checksum.slice(0, 8)}.json`),
    JSON.stringify(checkpoint),
  );
  return { id, file, sha256: checksum };
}
export async function backupDatabase(db: DatabaseSync) {
  const id = new Date().toISOString().replaceAll(":", "-");
  fs.mkdirSync("data/backups", { recursive: true });
  const file = `data/backups/metric-${id}.sqlite`;
  await backup(db, file);
  return file;
}
