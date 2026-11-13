import {
  encodeFunctionData,
  decodeFunctionResult,
  multicall3Abi,
  type Hex,
} from "viem";
const MULTICALL = "0xca11bde05977b3631167028862be2a173976ca11" as const;
let nextRequest = 0;
async function gatedRpc(url: string, method: string, params: unknown[]) {
  for (let attempt = 0; attempt < 7; attempt++) {
    const wait = Math.max(0, nextRequest - Date.now());
    nextRequest = Math.max(Date.now(), nextRequest) + 1100;
    if (wait) await new Promise((r) => setTimeout(r, wait));
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: AbortSignal.timeout(45000),
    });
    if (r.status === 429 || r.status >= 500) {
      const delay = Math.max(
        Number(r.headers.get("retry-after") || 0) * 1000,
        Math.min(30000, 2000 * 2 ** attempt),
      );
      nextRequest = Math.max(nextRequest, Date.now() + delay);
      console.log(
        `LP archive RPC retry ${r.status}; cooldown ${delay / 1000}s`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }
    if (!r.ok) {
      let message = "";
      try {
        const j = await r.json();
        message = String(j.error?.message || j.message || "").slice(0, 250);
      } catch {}
      throw new Error(`LP archive RPC HTTP ${r.status}: ${message}`);
    }
    const j = await r.json();
    if (j.error)
      throw new Error(`LP archive RPC ${j.error.code}: ${j.error.message}`);
    if (j.result === undefined) throw new Error("Missing LP RPC result");
    return j.result as Hex;
  }
  throw new Error("LP archive RPC retry limit reached");
}
type Request = {
  to: Hex;
  data: Hex;
  resolve: (data: Hex) => void;
  reject: (e: Error) => void;
};
export class LPReader {
  private queue: Request[] = [];
  private scheduled = false;
  private running = false;
  private useMulticall = true;
  constructor(
    private url: string,
    private block: Hex | "latest",
  ) {}
  async check(chainId: number) {
    const actual = Number(await gatedRpc(this.url, "eth_chainId", []));
    if (actual !== chainId) throw new Error("LP archive network mismatch");
    const code = await gatedRpc(this.url, "eth_getCode", [
      MULTICALL,
      this.block,
    ]);
    this.useMulticall = code !== "0x";
    console.log(
      `LP ${chainId}: ${this.useMulticall ? "Multicall batches" : "direct reads"} at ${this.block}`,
    );
  }
  read(to: string, data: Hex): Promise<Hex> {
    return new Promise((resolve, reject) => {
      this.queue.push({ to: to as Hex, data, resolve, reject });
      this.schedule();
    });
  }
  private schedule() {
    if (!this.queue.length || this.scheduled || this.running) return;
    this.scheduled = true;
    setTimeout(() => {
      this.scheduled = false;
      void this.flush();
    }, 25);
  }
  private async flush() {
    if (this.running) return;
    this.running = true;
    try {
      while (this.queue.length) {
        const batch = this.queue.splice(0, this.useMulticall ? 10 : 1);
        try {
          if (this.useMulticall) {
            await this.execute(batch);
          } else
            batch[0].resolve(
              await gatedRpc(this.url, "eth_call", [
                { to: batch[0].to, data: batch[0].data },
                this.block,
              ]),
            );
        } catch (e) {
          for (const r of batch)
            r.reject(e instanceof Error ? e : new Error(String(e)));
        }
      }
    } finally {
      this.running = false;
      this.schedule();
    }
  }
  private async execute(batch: Request[]): Promise<void> {
    try {
      const data = encodeFunctionData({
        abi: multicall3Abi,
        functionName: "aggregate3",
        args: [
          batch.map((r) => ({
            target: r.to,
            allowFailure: true,
            callData: r.data,
          })),
        ],
      });
      const raw = await gatedRpc(this.url, "eth_call", [
        { to: MULTICALL, data },
        this.block,
      ]);
      const result = decodeFunctionResult({
        abi: multicall3Abi,
        functionName: "aggregate3",
        data: raw,
      });
      if (result.length !== batch.length)
        throw new Error("Multicall response length mismatch");
      result.forEach((r, i) =>
        r.success
          ? batch[i].resolve(r.returnData)
          : batch[i].reject(new Error("Pool state call reverted")),
      );
    } catch (e) {
      if (
        String(e).includes("HTTP 400") ||
        /gas|limit|too large/i.test(String(e))
      ) {
        if (batch.length > 1) {
          const mid = Math.ceil(batch.length / 2);
          await this.execute(batch.slice(0, mid));
          await this.execute(batch.slice(mid));
          return;
        }
        batch[0].resolve(
          await gatedRpc(this.url, "eth_call", [
            { to: batch[0].to, data: batch[0].data },
            this.block,
          ]),
        );
        return;
      }
      throw e;
    }
  }
}
