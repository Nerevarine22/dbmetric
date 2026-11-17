import test from "node:test";
import assert from "node:assert/strict";
import { checkManifest, type Manifest } from "./cloudCheckpoint";

const example = (): Manifest => ({
  version: 1, createdAt: "2026-11-17T10:00:00.000Z", rawBytes: 6000000000,
  rawSha256: "a".repeat(64), parts: [
    { name: "metric-checkpoint-2026-11-17T10-00-00.000Z-part-000.gz", bytes: 512 * 1024 ** 2, sha256: "b".repeat(64) },
    { name: "metric-checkpoint-2026-11-17T10-00-00.000Z-part-001.gz", bytes: 42, sha256: "c".repeat(64) },
  ],
});
test("checkpoint manifest accepts ordered, checksummed, bounded archive parts", () => {
  const manifest = example();
  assert.equal(checkManifest(manifest), manifest);
});
test("checkpoint manifest rejects corrupted, missing, reordered and cross-version parts", () => {
  const changes: ((m: Manifest) => void)[] = [
    m => { m.rawSha256 = "invalid"; },
    m => { m.parts = []; },
    m => { m.parts.reverse(); },
    m => { m.parts[1] = { ...m.parts[0] }; },
    m => { m.parts[0].name = "../../metric.sqlite"; },
    m => { m.parts[0].name = m.parts[0].name.replace("2026-11-17", "2026-11-16"); },
    m => { m.parts[0].bytes = 512 * 1024 ** 2 + 1; },
    m => { m.parts[0].bytes = -1; },
    m => { m.parts[0].sha256 = "x".repeat(64); },
    m => { m.rawBytes = Number.MAX_SAFE_INTEGER + 1; },
  ];
  for (const change of changes) {
    const manifest = example(); change(manifest);
    assert.throws(() => checkManifest(manifest));
  }
});
