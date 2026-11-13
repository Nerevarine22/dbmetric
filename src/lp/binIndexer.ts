import type { DatabaseSync } from "node:sqlite";
import { toEventSelector } from "viem";
import { CHAINS, type Pool } from "../core";
import { queryHyperSync } from "../hypersync";
import { rpc, hex } from "../rpc";
export const BIN_TOPIC = toEventSelector("BinSwapped(int256,uint256,uint256)");
export function decodeBinSwap(data: string) {
  if (!/^0x[0-9a-f]{192}$/i.test(data))
    throw new Error("Invalid BinSwapped data");
  const bin = BigInt.asIntN(256, BigInt("0x" + data.slice(2, 66)));
  if (bin < -32768n || bin > 32767n)
    throw new Error("BinSwapped index outside int16");
  const packed = BigInt("0x" + data.slice(66, 130));
  return {
    bin: Number(bin),
    delta0: BigInt.asIntN(128, packed >> 128n),
    delta1: BigInt.asIntN(128, packed & ((1n << 128n) - 1n)),
  };
}
export async function indexBinSwaps(
  db: DatabaseSync,
  pools: Pool[],
  chain: (typeof CHAINS)[number],
) {
  const target = db
    .prepare("SELECT * FROM lp_coverage WHERE chain_id=?")
    .get(chain.id);
  if (
    !target ||
    target.status !== "complete" ||
    Number(target.from_block) > Number(target.genesis_block)
  )
    throw new Error("LP history required for bin replay");
  const head = Number(target.to_block);
  const selected = pools.filter(
    (p) => p.chainId === chain.id && p.createdBlockNumber <= head,
  );
  const url = process.env[`RPC_${chain.id}`] || chain.rpc;
  const token = process.env.ENVIO_API_TOKEN;
  if (!token)
    throw new Error("ENVIO_API_TOKEN required for bin balance replay");
  const missing = selected.filter(
    (p) =>
      !db
        .prepare(
          "SELECT 1 FROM lp_bin_coverage WHERE chain_id=? AND pool_address=?",
        )
        .get(chain.id, p.poolAddress),
  );
  if (missing.length) {
    const start = Math.min(...missing.map((p) => p.createdBlockNumber));
    const q = db.prepare("INSERT INTO lp_bin_coverage VALUES(?,?,?,?,?,0)");
    db.exec("BEGIN");
    try {
      for (const p of missing)
        q.run(chain.id, p.poolAddress, start, start - 1, null);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  // A finalized-prefix hash check allows appending without replaying or double-counting prior pages.
  for (const group of db
    .prepare(
      "SELECT to_block,block_hash,MIN(from_block) start FROM lp_bin_coverage WHERE chain_id=? AND block_hash IS NOT NULL GROUP BY to_block,block_hash",
    )
    .all(chain.id)) {
    const block = await rpc(url, "eth_getBlockByNumber", [
      hex(Number(group.to_block)),
      false,
    ]);
    if (block.hash !== group.block_hash || Number(group.to_block) > head) {
      db.exec("BEGIN");
      try {
        const affected = db
          .prepare(
            "SELECT pool_address FROM lp_bin_coverage WHERE chain_id=? AND to_block=?",
          )
          .all(chain.id, group.to_block);
        for (const p of affected)
          db.prepare(
            "DELETE FROM lp_bin_swap_totals WHERE chain_id=? AND pool_address=?",
          ).run(chain.id, p.pool_address);
        db.prepare(
          "UPDATE lp_bin_coverage SET to_block=from_block-1,block_hash=NULL,event_count=0 WHERE chain_id=? AND to_block=?",
        ).run(chain.id, group.to_block);
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    }
  }
  while (true) {
    const state = db
      .prepare(
        "SELECT MIN(to_block) next FROM lp_bin_coverage WHERE chain_id=?",
      )
      .get(chain.id)!;
    if (state.next === null || Number(state.next) >= head) break;
    let from = Number(state.next) + 1;
    const addresses = db
      .prepare(
        "SELECT pool_address FROM lp_bin_coverage WHERE chain_id=? AND to_block=?",
      )
      .all(chain.id, state.next)
      .map((r) => String(r.pool_address));
    const known = new Set(addresses);
    while (from <= head) {
      const response = await queryHyperSync(
        chain.id,
        token,
        from,
        head + 1,
        addresses,
        BIN_TOPIC,
        (status, bytes) =>
          db
            .prepare(
              "INSERT INTO api_requests(chain_id,requested_at,from_block,to_block,status,bytes) VALUES(?,?,?,?,?,?)",
            )
            .run(
              chain.id,
              Math.floor(Date.now() / 1000),
              from,
              head,
              status,
              bytes,
            ),
        true,
      );
      if (response.nextBlock <= from)
        throw new Error("Bin replay cursor did not advance");
      const through = Math.min(head, response.nextBlock - 1);
      const delta = new Map<
        string,
        { pool: string; bin: number; a: bigint; b: bigint }
      >();
      const counts = new Map<string, number>();
      for (const log of response.data.logs) {
        if (log.removed) continue;
        const pool = log.address.toLowerCase();
        if (!known.has(pool)) throw new Error("Unexpected bin swap pool");
        const d = decodeBinSwap(log.data);
        const key = pool + ":" + d.bin;
        const prior = delta.get(key) || { pool, bin: d.bin, a: 0n, b: 0n };
        prior.a += d.delta0;
        prior.b += d.delta1;
        delta.set(key, prior);
        counts.set(pool, (counts.get(pool) || 0) + 1);
      }
      const boundary = await rpc(url, "eth_getBlockByNumber", [
        hex(through),
        false,
      ]);
      db.exec("BEGIN");
      try {
        for (const d of delta.values()) {
          const old = db
            .prepare(
              "SELECT delta0,delta1 FROM lp_bin_swap_totals WHERE chain_id=? AND pool_address=? AND bin=?",
            )
            .get(chain.id, d.pool, d.bin);
          db.prepare(
            "INSERT OR REPLACE INTO lp_bin_swap_totals VALUES(?,?,?,?,?)",
          ).run(
            chain.id,
            d.pool,
            d.bin,
            (BigInt(String(old?.delta0 ?? 0)) + d.a).toString(),
            (BigInt(String(old?.delta1 ?? 0)) + d.b).toString(),
          );
        }
        const q = db.prepare(
          "UPDATE lp_bin_coverage SET to_block=?,block_hash=?,event_count=event_count+? WHERE chain_id=? AND pool_address=?",
        );
        for (const address of addresses)
          q.run(
            through,
            String(boundary.hash),
            counts.get(address) || 0,
            chain.id,
            address,
          );
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
      console.log(
        `${chain.name}: BinSwapped through ${through}/${head}, +${response.data.logs.length} logs, ${delta.size} changed bins`,
      );
      from = through + 1;
    }
  }
}
