import type { DatabaseSync } from "node:sqlite";
import type { LPEvent } from "./core";
export function initLP(db: DatabaseSync) {
  db.exec(`
 CREATE TABLE IF NOT EXISTS lp_events(chain_id INTEGER,tx_hash TEXT,log_index INTEGER,block_number INTEGER,timestamp INTEGER,pool_address TEXT,owner TEXT,action TEXT,data TEXT NOT NULL,PRIMARY KEY(chain_id,tx_hash,log_index));
 CREATE INDEX IF NOT EXISTS lp_events_block ON lp_events(chain_id,block_number,log_index);
 CREATE INDEX IF NOT EXISTS lp_events_owner ON lp_events(owner);
 CREATE TABLE IF NOT EXISTS lp_coverage(chain_id INTEGER PRIMARY KEY,from_block INTEGER,from_timestamp INTEGER,to_block INTEGER,to_timestamp INTEGER,genesis_block INTEGER,registry_json TEXT,status TEXT,error TEXT);
 CREATE TABLE IF NOT EXISTS lp_configs(chain_id INTEGER,pool_address TEXT,factor0 TEXT,factor1 TEXT,empty_verified INTEGER DEFAULT 0,PRIMARY KEY(chain_id,pool_address));
 CREATE TABLE IF NOT EXISTS lp_positions(chain_id INTEGER,pool_address TEXT,owner TEXT,salt TEXT,bin INTEGER,shares TEXT,amount0_scaled TEXT,amount1_scaled TEXT,active_usd REAL,error TEXT,PRIMARY KEY(chain_id,pool_address,owner,salt,bin));
 CREATE INDEX IF NOT EXISTS lp_positions_owner ON lp_positions(owner);
 CREATE TABLE IF NOT EXISTS lp_pool_valuations(chain_id INTEGER,pool_address TEXT,block_number INTEGER,timestamp INTEGER,status TEXT,error TEXT,PRIMARY KEY(chain_id,pool_address));
 CREATE TABLE IF NOT EXISTS lp_valuation_heads(chain_id INTEGER PRIMARY KEY,block_number INTEGER,timestamp INTEGER,block_hash TEXT,priced_at INTEGER);
 CREATE TABLE IF NOT EXISTS lp_bin_swap_totals(chain_id INTEGER,pool_address TEXT,bin INTEGER,delta0 TEXT,delta1 TEXT,PRIMARY KEY(chain_id,pool_address,bin));
 CREATE TABLE IF NOT EXISTS lp_bin_coverage(chain_id INTEGER,pool_address TEXT,from_block INTEGER,to_block INTEGER,block_hash TEXT,event_count INTEGER,PRIMARY KEY(chain_id,pool_address));
 `);
}
export function saveLPPage(
  db: DatabaseSync,
  events: LPEvent[],
  chainId: number,
  through: number,
  timestamp: number,
) {
  const insert = db.prepare(
    "INSERT OR REPLACE INTO lp_events VALUES(?,?,?,?,?,?,?,?,?)",
  );
  db.exec("BEGIN");
  try {
    for (const e of events)
      insert.run(
        e.chainId,
        e.txHash,
        e.logIndex,
        e.blockNumber,
        e.timestamp,
        e.poolAddress,
        e.owner,
        e.action,
        JSON.stringify(e),
      );
    db.prepare(
      "UPDATE lp_coverage SET to_block=?,to_timestamp=?,status='indexing',error=NULL WHERE chain_id=?",
    ).run(through, timestamp, chainId);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
