import { queryHyperSync } from "./hypersync";
import { toEventSelector } from "viem";
import type { DatabaseSync } from "node:sqlite";
import {
  CHAINS,
  decodePackedSwap,
  valueSwap,
  type Pool,
  type Swap,
} from "./core";
import { savePage } from "./db";
import { rpc, hex, blockAtTimestamp } from "./rpc";
const TOPIC = toEventSelector("Swap(address,address,uint256,uint256,uint256)");
type RawLog = {
  address: string;
  data: string;
  topics: (string | null | undefined)[];
  transactionHash: string;
  logIndex: number;
  blockNumber: number;
};
export function decodeLog(
  log: RawLog,
  pool: Pool,
  from: string,
  timestamp: number,
): Swap {
  if (log.data.length !== 194 || !log.topics[1] || !log.topics[2])
    throw new Error("Invalid Swap log payload");
  const [details, amounts, fees] = [0, 1, 2].map((i) =>
    BigInt("0x" + log.data.slice(2 + i * 64, 66 + i * 64)),
  );
  const decoded = decodePackedSwap(details, amounts, fees);
  return {
    chainId: pool.chainId,
    txHash: log.transactionHash.toLowerCase(),
    logIndex: log.logIndex,
    blockNumber: log.blockNumber,
    timestamp,
    poolAddress: pool.poolAddress,
    traderAddress: from.toLowerCase(),
    senderRouter: "0x" + log.topics[1].slice(-40).toLowerCase(),
    recipient: "0x" + log.topics[2].slice(-40).toLowerCase(),
    amount0Delta: decoded.amount0Delta.toString(),
    amount1Delta: decoded.amount1Delta.toString(),
    ...valueSwap(pool, decoded.amount0Delta, decoded.amount1Delta),
    binIdx: decoded.binIdx,
  };
}
export async function indexChain(
  db: DatabaseSync,
  pools: Pool[],
  chain: (typeof CHAINS)[number],
  days: number | "all",
) {
  const selected = pools.filter((p) => p.chainId === chain.id);
  if (!selected.length) throw new Error(`No pools for ${chain.name}`);
  const poolMap = new Map(selected.map((p) => [p.poolAddress, p]));
  const genesis = Math.min(...selected.map((p) => p.createdBlockNumber));
  const url = process.env[`RPC_${chain.id}`] || chain.rpc;
  const head =
    Number(await rpc(url, "eth_blockNumber", [])) - chain.confirmations;
  const headBlock = await rpc(url, "eth_getBlockByNumber", [hex(head), false]);
  const until = Number(headBlock.timestamp);
  let state = db
    .prepare("SELECT * FROM coverage WHERE chain_id=?")
    .get(chain.id) as
    | { from_block: number; from_timestamp?: number; to_block: number }
    | undefined;
  const requestedTimestamp = days === "all" ? 0 : until - days * 86400 - 120;
  const requestedStart =
    days === "all"
      ? genesis
      : state && Number(state.from_timestamp) <= requestedTimestamp
        ? state.from_block
        : await blockAtTimestamp(url, requestedTimestamp, head, genesis);
  // A wider backfill restarts at the wider lower bound; INSERT OR REPLACE makes overlapping pages idempotent.
  if (!state || requestedStart < state.from_block) {
    const first = await rpc(url, "eth_getBlockByNumber", [
      hex(requestedStart),
      false,
    ]);
    db.prepare("INSERT OR REPLACE INTO coverage VALUES(?,?,?,?,?,?,?,?)").run(
      chain.id,
      requestedStart,
      Number(first.timestamp),
      requestedStart - 1,
      Number(first.timestamp),
      genesis,
      "indexing",
      null,
    );
    state = { from_block: requestedStart, to_block: requestedStart - 1 };
  }
  let from = state.to_block + 1;
  if (from > head) {
    db.prepare(
      "UPDATE coverage SET status='complete',error=NULL WHERE chain_id=?",
    ).run(chain.id);
    return;
  }
  // Replay a finalized overlap before extending coverage, replacing stale data in that suffix.
  if (state.to_block >= state.from_block) {
    from = Math.max(state.from_block, from - chain.confirmations);
    db.prepare("DELETE FROM swaps WHERE chain_id=? AND block_number>=?").run(
      chain.id,
      from,
    );
    db.prepare("UPDATE coverage SET to_block=? WHERE chain_id=?").run(
      from - 1,
      chain.id,
    );
  }
  const token = process.env.ENVIO_API_TOKEN;
  console.log(
    `${chain.name}: ${token ? "HyperSync" : "RPC"} blocks ${from}..${head} (${days} days)`,
  );
  try {
    while (from <= head) {
      let rows: Swap[] = [];
      let through: number;
      if (token) {
        const res = await queryHyperSync(
          chain.id,
          token,
          from,
          head + 1,
          [...poolMap.keys()],
          TOPIC,
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
        if (res.nextBlock <= from)
          throw new Error("HyperSync cursor did not advance");
        through = Math.min(head, res.nextBlock - 1);
        const txs = new Map(
          res.data.transactions.map((t) => [t.hash?.toLowerCase(), t.from]),
        );
        const blocks = new Map(
          res.data.blocks.map((b) => [b.number, Number(b.timestamp)]),
        );
        for (const log of res.data.logs) {
          if (log.removed) continue;
          const pool = poolMap.get(log.address!.toLowerCase());
          if (!pool) continue;
          const fromAddress = txs.get(log.transactionHash!.toLowerCase());
          const ts = blocks.get(log.blockNumber);
          if (!fromAddress || !ts)
            throw new Error(
              "Missing transaction sender or block timestamp; page not committed",
            );
          rows.push(decodeLog(log as RawLog, pool, fromAddress, ts));
        }
      } else {
        through = Math.min(head, from + 4999);
        const logs = await rpc<any[]>(url, "eth_getLogs", [
          { fromBlock: hex(from), toBlock: hex(through), topics: [TOPIC] },
        ]);
        const txCache = new Map<string, string>();
        const blockCache = new Map<number, number>();
        for (const log of logs) {
          const pool = poolMap.get(log.address.toLowerCase());
          if (!pool || log.removed) continue;
          const n = Number(log.blockNumber);
          if (!txCache.has(log.transactionHash)) {
            const tx = await rpc(url, "eth_getTransactionByHash", [
              log.transactionHash,
            ]);
            txCache.set(log.transactionHash, tx.from);
          }
          if (!blockCache.has(n)) {
            const b = await rpc(url, "eth_getBlockByNumber", [hex(n), false]);
            blockCache.set(n, Number(b.timestamp));
          }
          rows.push(
            decodeLog(
              { ...log, logIndex: Number(log.logIndex), blockNumber: n },
              pool,
              txCache.get(log.transactionHash)!,
              blockCache.get(n)!,
            ),
          );
        }
      }
      const boundary = await rpc(url, "eth_getBlockByNumber", [
        hex(through),
        false,
      ]);
      savePage(db, rows, chain.id, through, Number(boundary.timestamp));
      console.log(
        `${chain.name}: through ${through}/${head}, +${rows.length} swaps`,
      );
      from = through + 1;
    }
    db.prepare(
      "UPDATE coverage SET status='complete',error=NULL WHERE chain_id=?",
    ).run(chain.id);
  } catch (e) {
    db.prepare(
      "UPDATE coverage SET status='error',error=? WHERE chain_id=?",
    ).run(
      String(e).replaceAll(
        process.env.ENVIO_API_TOKEN ?? "__NO_TOKEN__",
        "[redacted]",
      ),
      chain.id,
    );
    throw e;
  }
}
