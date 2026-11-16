type Options = {
  label: string;
  timeoutMs?: number;
  maxAttempts?: number;
  beforeAttempt?: () => Promise<void>;
  onAttempt?: (status: number, bytes: number) => void;
  onRetry?: (delayMs: number) => void;
  retryProvider400?: boolean;
  fetcher?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
};
class HttpError extends Error {
  constructor(readonly status: number, readonly retryAfter: string | null, readonly detail = "") {
    super(`HTTP ${status}${detail ? ": " + detail : ""}`);
  }
}
function transient(error: unknown, retryProvider400 = false) {
  if (error instanceof HttpError && error.status === 400 && retryProvider400) {
    // Some archive providers use 400 for intermittent backend failures.
    // Known request-size/gas failures still go straight to adaptive splitting.
    return !/invalid (params|parameters|argument|api key)|unauthori[sz]ed|forbidden|gas|too large|request size|response size/i.test(error.detail);
  }
  if (error instanceof HttpError)
    return error.status === 408 || error.status === 429 || error.status >= 500;
  if (!(error instanceof Error)) return false;
  if (error.name === "TimeoutError" || error.name === "AbortError") return true;
  if (error instanceof TypeError && /fetch|network|socket|terminated/i.test(error.message)) return true;
  const code = (error.cause as { code?: string } | undefined)?.code;
  return !!code && /^(ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|UND_ERR_)/.test(code);
}

// The deadline covers response-body consumption too, not only response headers.
export async function requestText(url: string, init: RequestInit, options: Options) {
  const { label, timeoutMs = 60_000, maxAttempts = 4, fetcher = fetch,
    sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)) } = options;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10)
    throw new Error("HTTP maxAttempts must be between 1 and 10");
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let observed = false;
    try {
      init.signal?.throwIfAborted();
      await options.beforeAttempt?.();
      const deadline = AbortSignal.timeout(timeoutMs);
      const signal = init.signal ? AbortSignal.any([init.signal, deadline]) : deadline;
      const response = await fetcher(url, { ...init, signal });
      if (!response.ok) {
        observed = true;
        options.onAttempt?.(response.status, 0);
        let detail = "";
        try {
          const raw = await response.text();
          const j = JSON.parse(raw);
          detail = String(j.error?.message ?? j.message ?? "").slice(0, 250);
        } catch (error) {
          if (error instanceof Error && (error.name === "TimeoutError" || error instanceof TypeError)) throw error;
        }
        throw new HttpError(response.status, response.headers.get("retry-after"), detail);
      }
      const body = await response.text();
      observed = true;
      options.onAttempt?.(response.status, Buffer.byteLength(body));
      return { status: response.status, body };
    } catch (error) {
      if (!observed) options.onAttempt?.(0, 0);
      if (init.signal?.aborted || !transient(error, options.retryProvider400) || attempt + 1 === maxAttempts) {
        const reason = error instanceof Error ? error.message : "request failed";
        throw new Error(`${label}: ${reason} after ${attempt + 1} attempt(s)`, { cause: error });
      }
      const retryAfter = error instanceof HttpError ? error.retryAfter : null;
      const serverDelay = retryAfter
        ? (/^\d+(\.\d+)?$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now())
        : 0;
      const delay = Math.min(30_000, Math.max(1000 * 2 ** attempt, Number.isFinite(serverDelay) ? serverDelay : 0));
      options.onRetry?.(delay);
      console.log(`${label}: ${error instanceof HttpError ? error.message : "network/timeout"}; retry ${attempt + 2}/${maxAttempts} in ${delay / 1000}s`);
      await sleep(delay);
    }
  }
  throw new Error(`${label}: retry limit reached`);
}
