import test from "node:test";
import assert from "node:assert/strict";
import { requestText } from "./http";

test("retries transient timeouts then returns a successful body", async () => {
  let calls = 0;
  const attempts: number[] = [], waits: number[] = [];
  const result = await requestText("https://example.invalid", {}, {
    label: "test", fetcher: async () => {
      if (++calls < 3) throw new DOMException("deadline", "TimeoutError");
      return new Response("ok");
    }, onAttempt: status => attempts.push(status), sleep: async ms => { waits.push(ms); },
  });
  assert.equal(result.body, "ok"); assert.equal(calls, 3);
  assert.deepEqual(attempts, [0, 0, 200]); assert.deepEqual(waits, [1000, 2000]);
});
test("retries failures while consuming response bodies", async () => {
  let calls = 0;
  const result = await requestText("https://example.invalid", {}, {
    label: "test", fetcher: async () => {
      calls++;
      return calls === 1 ? new Response(new ReadableStream({ start(c) { c.error(new TypeError("terminated")); } })) : new Response("complete");
    }, sleep: async () => {},
  });
  assert.equal(calls, 2); assert.equal(result.body, "complete");
});
test("rate-limit backoff respects Retry-After with a 30 second cap", async () => {
  let calls = 0; const waits: number[] = [];
  await requestText("https://example.invalid", {}, {
    label: "test", fetcher: async () => ++calls === 1
      ? new Response("busy", { status: 429, headers: { "retry-after": "600" } }) : new Response("ok"),
    sleep: async ms => { waits.push(ms); },
  });
  assert.deepEqual(waits, [30_000]);
});
test("permanent authorization errors fail once without retrying", async () => {
  let calls = 0;
  await assert.rejects(requestText("https://example.invalid", {}, {
    label: "test", fetcher: async () => { calls++; return new Response("unauthorized", { status: 401 }); },
    sleep: async () => { assert.fail("Permanent errors must not sleep"); },
  }), /HTTP 401 after 1 attempt/);
  assert.equal(calls, 1);
});
test("persistent transport failures stop at the configured limit", async () => {
  let calls = 0;
  await assert.rejects(requestText("https://example.invalid", {}, {
    label: "test", maxAttempts: 2, fetcher: async () => { calls++; throw new TypeError("fetch failed"); },
    sleep: async () => {},
  }), /after 2 attempt/);
  assert.equal(calls, 2);
});
