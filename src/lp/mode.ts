export function useEventReplay(chainId: number, env: Record<string, string | undefined> = process.env) {
  return (chainId === 56 || chainId === 4663) && !env[`LP_RPC_${chainId}`];
}
