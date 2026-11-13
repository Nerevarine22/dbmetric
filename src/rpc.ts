export const hex = (v: number) => "0x" + v.toString(16);
export async function rpc<T = any>(
  url: string,
  method: string,
  params: unknown[],
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        signal: AbortSignal.timeout(45000),
      });
      if (!r.ok) throw new Error(`RPC HTTP ${r.status}`);
      const j = await r.json();
      if (j.error) throw new Error(`RPC ${j.error.code}: ${j.error.message}`);
      if (j.result === undefined || j.result === null)
        throw new Error(`RPC missing ${method} result`);
      return j.result;
    } catch (e) {
      if (attempt >= 3) throw e;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
}
export async function blockAtTimestamp(
  url: string,
  timestamp: number,
  head: number,
  floor: number,
) {
  let lo = floor,
    hi = head;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const b = await rpc(url, "eth_getBlockByNumber", [hex(mid), false]);
    if (Number(b.timestamp) < timestamp) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
