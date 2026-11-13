import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import pathUtils from "node:path";
import type { Pool, Swap } from "./core";
import { initLP } from "./lp/db";
export function openDb(path = "data/metric.sqlite") {
  fs.mkdirSync("data", { recursive: true });
  const db = new DatabaseSync(path);
  const temporaryDirectory = pathUtils.resolve("data/tmp");
  fs.mkdirSync(temporaryDirectory, { recursive: true });
  db.exec(
    `PRAGMA temp_store_directory='${temporaryDirectory.replaceAll("\\", "/").replaceAll("'", "''")}'`,
  );
  db.exec(
    "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=30000; PRAGMA cache_size=-131072; PRAGMA synchronous=NORMAL;",
  );
  db.exec(`CREATE TABLE IF NOT EXISTS pools(chain_id INTEGER,address TEXT,metadata TEXT NOT NULL,PRIMARY KEY(chain_id,address));
    CREATE TABLE IF NOT EXISTS swaps(chain_id INTEGER,tx_hash TEXT,log_index INTEGER,block_number INTEGER,timestamp INTEGER,trader TEXT,data TEXT NOT NULL,PRIMARY KEY(chain_id,tx_hash,log_index));
    CREATE INDEX IF NOT EXISTS swaps_time ON swaps(timestamp); CREATE INDEX IF NOT EXISTS swaps_trader ON swaps(trader);
    CREATE INDEX IF NOT EXISTS swaps_chain_block ON swaps(chain_id,block_number);
    CREATE TABLE IF NOT EXISTS coverage(chain_id INTEGER PRIMARY KEY,from_block INTEGER,from_timestamp INTEGER,to_block INTEGER,to_timestamp INTEGER,genesis_block INTEGER,status TEXT,error TEXT);
    CREATE TABLE IF NOT EXISTS runs(id INTEGER PRIMARY KEY,started_at INTEGER,completed_at INTEGER,status TEXT);
    CREATE TABLE IF NOT EXISTS api_requests(id INTEGER PRIMARY KEY,chain_id INTEGER,requested_at INTEGER,from_block INTEGER,to_block INTEGER,status INTEGER,bytes INTEGER);`);
  const columns = new Set(
    db
      .prepare("PRAGMA table_info(swaps)")
      .all()
      .map((c) => c.name),
  );
  let migrationNeeded = false;
  for (const [name, type] of [
    ["pool_address", "TEXT"],
    ["volume_usd", "REAL"],
    ["price_mode", "TEXT"],
    ["sender_router", "TEXT"],
  ])
    if (!columns.has(name)) {
      db.exec(`ALTER TABLE swaps ADD COLUMN ${name} ${type}`);
      migrationNeeded = true;
    }
  if (migrationNeeded)
    db.exec(
      `UPDATE swaps SET pool_address=json_extract(data,'$.poolAddress'),volume_usd=json_extract(data,'$.volumeUsd'),price_mode=json_extract(data,'$.priceMode'),sender_router=json_extract(data,'$.senderRouter') WHERE price_mode IS NULL;`,
    );
  db.exec(
    "CREATE INDEX IF NOT EXISTS swaps_analytics_cover ON swaps(timestamp,chain_id,trader,tx_hash,pool_address,volume_usd,price_mode,sender_router)",
  );
  initLP(db);
  return db;
}
export function savePools(db: DatabaseSync, pools: Pool[]) {
  const q = db.prepare("INSERT OR REPLACE INTO pools VALUES(?,?,?)");
  const existing = db.prepare(
    "SELECT 1 FROM pools WHERE chain_id=? AND address=?",
  );
  db.exec("BEGIN");
  try {
    for (const p of pools) {
      const isNew = !existing.get(p.chainId, p.poolAddress);
      q.run(p.chainId, p.poolAddress, JSON.stringify(p));
      if (isNew) {
        const state = db
          .prepare("SELECT * FROM coverage WHERE chain_id=?")
          .get(p.chainId);
        if (state && p.createdBlockNumber <= Number(state.to_block)) {
          const restart = Math.max(
            Number(state.from_block),
            p.createdBlockNumber,
          );
          db.prepare(
            "UPDATE coverage SET to_block=?,to_timestamp=?,status='indexing',error=NULL WHERE chain_id=?",
          ).run(restart - 1, p.createdTimestamp - 1, p.chainId);
        }
      }
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
export function savePage(
  db: DatabaseSync,
  swaps: Swap[],
  chainId: number,
  through: number,
  timestamp: number,
) {
  const q = db.prepare(
    "INSERT OR REPLACE INTO swaps(chain_id,tx_hash,log_index,block_number,timestamp,trader,data,pool_address,volume_usd,price_mode,sender_router) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
  );
  db.exec("BEGIN");
  try {
    for (const s of swaps)
      q.run(
        s.chainId,
        s.txHash,
        s.logIndex,
        s.blockNumber,
        s.timestamp,
        s.traderAddress,
        JSON.stringify(s),
        s.poolAddress,
        s.volumeUsd,
        s.priceMode,
        s.senderRouter,
      );
    db.prepare(
      "UPDATE coverage SET to_block=?,to_timestamp=?,status='indexing',error=NULL WHERE chain_id=?",
    ).run(through, timestamp, chainId);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
export function loadSwaps(db: DatabaseSync): Swap[] {
  return db
    .prepare("SELECT data FROM swaps ORDER BY timestamp")
    .all()
    .map((r) => JSON.parse(r.data as string));
}
export function loadPools(db: DatabaseSync): Pool[] {
  return db
    .prepare("SELECT metadata FROM pools")
    .all()
    .map((r) => JSON.parse(r.metadata as string));
}
