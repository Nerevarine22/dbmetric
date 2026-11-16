// JSON transport uses HyperSync's public /query API and works without native bindings on Windows.
import { requestText } from "./http";
export async function queryHyperSync(
  chainId: number,
  token: string,
  from: number,
  to: number,
  addresses: string[],
  topic: string | string[],
  onRequest?: (status: number, bytes: number) => void,
  light = false,
) {
    const { body } = await requestText(`https://${chainId}.hypersync.xyz/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        from_block: from,
        to_block: to,
        logs: [
          {
            address: addresses,
            topics: [Array.isArray(topic) ? topic : [topic]],
          },
        ],
        field_selection: {
          log: light
            ? ["address", "data", "block_number", "removed"]
            : [
                "address",
                "data",
                "topic0",
                "topic1",
                "topic2",
                "transaction_hash",
                "log_index",
                "block_number",
                "removed",
              ],
          transaction: light ? [] : ["hash", "from"],
          block: light ? [] : ["number", "timestamp"],
        },
        max_num_logs: 50000,
        max_num_transactions: 50000,
        max_num_blocks: 50000,
      }),
    }, { label: `HyperSync ${chainId}`, maxAttempts: 9, onAttempt: onRequest });
    const j = JSON.parse(body);
    const chunks = Array.isArray(j.data) ? j.data : [j.data];
    return {
      nextBlock: Number(j.next_block),
      data: {
        transactions: chunks.flatMap((c: any) => c.transactions ?? []) as {
          hash: string;
          from: string;
        }[],
        blocks: chunks.flatMap((c: any) => c.blocks ?? []) as {
          number: number;
          timestamp: number | string;
        }[],
        logs: chunks
          .flatMap((c: any) => c.logs ?? [])
          .map((l: any) => ({
            address: l.address,
            data: l.data,
            topics: [l.topic0, l.topic1, l.topic2],
            transactionHash: l.transaction_hash,
            logIndex: l.log_index,
            blockNumber: l.block_number,
            removed: l.removed,
          })) as {
          address: string;
          data: string;
          topics: string[];
          transactionHash: string;
          logIndex: number;
          blockNumber: number;
          removed?: boolean;
        }[],
      },
    };
}
