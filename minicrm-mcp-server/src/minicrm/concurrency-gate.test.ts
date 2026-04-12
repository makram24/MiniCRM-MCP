import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ConcurrencyGate } from "./concurrency-gate.js";

describe("ConcurrencyGate", () => {
  it("never exceeds max parallel workers", async () => {
    const g = new ConcurrencyGate(2);
    let concurrent = 0;
    let maxSeen = 0;

    async function work(): Promise<void> {
      await g.acquire();
      try {
        concurrent++;
        maxSeen = Math.max(maxSeen, concurrent);
        await new Promise((r) => setTimeout(r, 15));
      } finally {
        concurrent--;
        g.release();
      }
    }

    await Promise.all([work(), work(), work(), work(), work()]);
    assert.ok(maxSeen <= 2, `expected maxSeen <= 2, got ${maxSeen}`);
  });
});
