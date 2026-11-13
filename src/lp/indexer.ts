import type { DatabaseSync } from "node:sqlite";
import { CHAINS, type Pool } from "../core";
import { rpc, hex } from "../rpc";
import { queryHyperSync } from "../hypersync";
import { LP_TOPICS, decodeLPLog, type LPEvent } from "./core";
import { saveLPPage } from "./db";
export async function indexLPChain(
  db: DatabaseSync,
  pools: Pool[],
  chain: (typeof CHAINS)[number],
) {
  const target = db
    .prepare(
      "SELECT to_block,to_timestamp,status FROM coverage WHERE chain_id=?",
    )
    .get(chain.id);
  if (!target || target.status !== "complete")
    throw new Error("Complete swap coverage before LP indexing");
  const selected = pools.filter(
    (p) =>
      p.chainId === chain.id && p.createdBlockNumber <= Number(target.to_block),
  );
  if (!selected.length) throw new Error("No LP pools");
  const head = Number(target.to_block),
    genesis = Math.min(...selected.map((p) => p.createdBlockNumber));
  const url = process.env[`RPC_${chain.id}`] || chain.rpc;
  let state = db
    .prepare("SELECT * FROM lp_coverage WHERE chain_id=?")
    .get(chain.id);
  const registry = selected.map((p) => p.poolAddress).sort();
  const known = new Set<string>(
    state ? JSON.parse(String(state.registry_json)) : [],
  );
  const newPools = selected.filter((p) => !known.has(p.poolAddress));
  let from = state ? Number(state.to_block) + 1 : genesis;
  if (state && newPools.some((p) => p.createdBlockNumber < from))
    from = Math.min(...newPools.map((p) => p.createdBlockNumber), from);
  if (state)
    from = Math.max(
      genesis,
      Math.min(from, Number(state.to_block) + 1 - chain.confirmations),
    );
  const first = await rpc(url, "eth_getBlockByNumber", [hex(genesis), false]);
  from = Math.min(from, head + 1);
  if (!state) {
    db.prepare("INSERT INTO lp_coverage VALUES(?,?,?,?,?,?,?,?,?)").run(
      chain.id,
      genesis,
      Number(first.timestamp),
      genesis - 1,
      Number(first.timestamp),
      genesis,
      JSON.stringify(registry),
      "indexing",
      null,
    );
  } else {
    from = Math.max(genesis, from);
    const previous = await rpc(url, "eth_getBlockByNumber", [
      hex(Math.max(genesis, from - 1)),
      false,
    ]);
    db.exec("BEGIN");
    try {
      db.prepare(
        "DELETE FROM lp_events WHERE chain_id=? AND block_number>=?",
      ).run(chain.id, from);
      db.prepare(
        "UPDATE lp_coverage SET from_block=?,from_timestamp=?,to_block=?,to_timestamp=?,genesis_block=?,registry_json=?,status='indexing',error=NULL WHERE chain_id=?",
      ).run(
        genesis,
        Number(first.timestamp),
        from - 1,
        Number(previous.timestamp),
        genesis,
        JSON.stringify(registry),
        chain.id,
      );
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  const token = process.env.ENVIO_API_TOKEN;
  console.log(`${chain.name}: LP events ${from}..${head}`);
  try {
    while (from <= head) {
      let rows: LPEvent[] = [];
      let through: number;
      if (token) {
        const response = await queryHyperSync(
          chain.id,
          token,
          from,
          head + 1,
          registry,
          LP_TOPICS,
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
        );
        if (response.nextBlock <= from)
          throw new Error("LP cursor did not advance");
        through = Math.min(head, response.nextBlock - 1);
        const blocks = new Map(
          response.data.blocks.map((b) => [b.number, Number(b.timestamp)]),
        );
        rows = response.data.logs
          .filter((l) => !l.removed)
          .map((l) => {
            const ts = blocks.get(l.blockNumber);
            if (!ts) throw new Error("Missing LP timestamp");
            return decodeLPLog(l, chain.id, ts);
          });
      } else {
        through = Math.min(head, from + 4999);
        const logs = await rpc<any[]>(url, "eth_getLogs", [
          {
            address: registry,
            fromBlock: hex(from),
            toBlock: hex(through),
            topics: [LP_TOPICS],
          },
        ]);
        const blocks = new Map<number, number>();
        for (const l of logs) {
          if (l.removed) continue;
          const n = Number(l.blockNumber);
          if (!blocks.has(n))
            blocks.set(
              n,
              Number(
                (await rpc(url, "eth_getBlockByNumber", [hex(n), false]))
                  .timestamp,
              ),
            );
          rows.push(
            decodeLPLog(
              { ...l, blockNumber: n, logIndex: Number(l.logIndex) },
              chain.id,
              blocks.get(n)!,
            ),
          );
        }
      }
      const boundary = await rpc(url, "eth_getBlockByNumber", [
        hex(through),
        false,
      ]);
      saveLPPage(db, rows, chain.id, through, Number(boundary.timestamp));
      console.log(
        `${chain.name}: LP through ${through}/${head}, +${rows.length}`,
      );
      from = through + 1;
    }
    db.prepare(
      "UPDATE lp_coverage SET status='complete',error=NULL WHERE chain_id=?",
    ).run(chain.id);
  } catch (e) {
    db.prepare(
      "UPDATE lp_coverage SET status='error',error=? WHERE chain_id=?",
    ).run(String(e).replaceAll(token || "__none__", "[redacted]"), chain.id);
    throw e;
  }
}
