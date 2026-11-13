// JSON transport uses HyperSync's public /query API and works without native bindings on Windows.
export async function queryHyperSync(
  chainId: number,
  token: string,
  from: number,
  to: number,
  addresses: string[],
  topic: string,
  onRequest?: (status: number, bytes: number) => void,
) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(`https://${chainId}.hypersync.xyz/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        from_block: from,
        to_block: to,
        logs: [{ address: addresses, topics: [[topic]] }],
        field_selection: {
          log: [
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
          transaction: ["hash", "from"],
          block: ["number", "timestamp"],
        },
        max_num_logs: 50000,
        max_num_transactions: 50000,
        max_num_blocks: 50000,
      }),
      signal: AbortSignal.timeout(60000),
    });
    if ((r.status === 429 || r.status >= 500) && attempt < 8) {
      onRequest?.(r.status, 0);
      const delay = Math.min(
        30000,
        Math.max(
          1000,
          Number(r.headers.get("retry-after") || 0) * 1000,
          1000 * 2 ** attempt,
        ),
      );
      console.log(
        `HyperSync ${chainId}: rate limit/retry, waiting ${delay / 1000}s`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    if (!r.ok) {
      onRequest?.(r.status, 0);
      throw new Error(`HyperSync ${chainId}: HTTP ${r.status}`);
    }
    const body = await r.text();
    onRequest?.(r.status, Buffer.byteLength(body));
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
}
