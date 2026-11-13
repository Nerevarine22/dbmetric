import { CHAINS, FACTORY, type Pool } from "./core";
export async function syncPools(): Promise<Pool[]> {
  const pools: Pool[] = [];
  let offset: number | null = 0;
  const seen = new Set<number>();
  while (offset !== null) {
    if (seen.has(offset))
      throw new Error("Metric API pagination did not advance");
    seen.add(offset);
    const url = new URL("https://api.metric.xyz/public/v1/evm/metadata");
    url.search = new URLSearchParams({
      chainIds: "1,56,4663",
      include24h: "true",
      minTvlFiat: "0",
      count: "500",
      offset: String(offset),
    }).toString();
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw new Error(`Metric metadata HTTP ${r.status}`);
    // Preserve uint64 sentinels before the JSON parser converts them to float.
    const body = (await r.text()).replace(
      /("priceProviderCooldownSecs"\s*:\s*)(\d+)/g,
      '$1"$2"',
    );
    const page = JSON.parse(body);
    if (!Array.isArray(page.data)) throw new Error("Invalid metadata envelope");
    for (const p of page.data) {
      const chain = CHAINS.find((c) => c.apiName === p.chain);
      if (!chain || p.poolFactoryAddress?.toLowerCase() !== FACTORY) continue;
      if (
        !/^0x[0-9a-f]{40}$/i.test(p.poolAddress) ||
        !Number.isSafeInteger(p.createdBlockNumber)
      )
        throw new Error("Invalid pool metadata");
      pools.push({
        ...p,
        chainId: chain.id,
        poolAddress: p.poolAddress.toLowerCase(),
        token0: p.token0.toLowerCase(),
        token1: p.token1.toLowerCase(),
      });
    }
    offset = page.nextOffset ?? null;
  }
  return [
    ...new Map(pools.map((p) => [`${p.chainId}:${p.poolAddress}`, p])).values(),
  ];
}
