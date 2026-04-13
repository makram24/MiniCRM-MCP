import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MinicrmConfig } from "../config.js";
import type { MinicrmRequest, MinicrmResponse } from "./types.js";
import { backoffMs, RealMinicrmBackend } from "./real-backend.js";

class FakeRealBackend extends RealMinicrmBackend {
  private readonly queue: MinicrmResponse[];
  calls = 0;

  constructor(
    cfg: MinicrmConfig,
    responses: MinicrmResponse[],
    sleepFn: (ms: number) => Promise<void>
  ) {
    super(cfg, sleepFn);
    this.queue = [...responses];
  }

  protected override async rawHttps(_req: MinicrmRequest): Promise<MinicrmResponse> {
    this.calls++;
    return this.queue.shift() ?? { status: 500, bodyText: "{}" };
  }
}

function cfg(overrides: Partial<MinicrmConfig> = {}): MinicrmConfig {
  return {
    useMock: false,
    baseUrl: "https://r3.minicrm.hu",
    systemId: "1",
    apiKey: "k",
    rateLimitPerMinute: 10_000,
    maxConcurrentRequests: 10,
    max429Retries: 2,
    debugHttp: false,
    requestTimeoutMs: 1000,
    fixturesDir: ".",
    ...overrides,
  };
}

describe("backoffMs", () => {
  it("increases with attempts", () => {
    const a0 = backoffMs(0);
    const a1 = backoffMs(1);
    assert.ok(a1 >= a0);
  });
});

describe("RealMinicrmBackend retries", () => {
  it("retries on 429 and then succeeds", async () => {
    const slept: number[] = [];
    const b = new FakeRealBackend(
      cfg({ max429Retries: 2 }),
      [
        { status: 429, bodyText: "{}" },
        { status: 429, bodyText: "{}" },
        { status: 200, bodyText: "{\"ok\":true}" },
      ],
      async (ms) => {
        slept.push(ms);
      }
    );

    const res = await b.request({ method: "GET", pathname: "/Api/R3/Category" });
    assert.equal(res.status, 200);
    assert.equal(b.calls, 3);
    assert.equal(slept.length, 2);
  });

  it("does not retry non-429 responses", async () => {
    const b = new FakeRealBackend(
      cfg({ max429Retries: 5 }),
      [{ status: 404, bodyText: "{}" }],
      async () => {}
    );
    const res = await b.request({ method: "GET", pathname: "/Api/R3/Category" });
    assert.equal(res.status, 404);
    assert.equal(b.calls, 1);
  });

  it("returns final 429 after retry budget is exhausted", async () => {
    const slept: number[] = [];
    const b = new FakeRealBackend(
      cfg({ max429Retries: 2 }),
      [
        { status: 429, bodyText: "{}" },
        { status: 429, bodyText: "{}" },
        { status: 429, bodyText: "{}" },
      ],
      async (ms) => slept.push(ms)
    );
    const res = await b.request({ method: "GET", pathname: "/Api/R3/Category" });
    assert.equal(res.status, 429);
    assert.equal(b.calls, 3);
    assert.equal(slept.length, 2);
  });

  it("propagates underlying timeout/network errors", async () => {
    class ThrowingBackend extends RealMinicrmBackend {
      protected override async rawHttps(_req: MinicrmRequest): Promise<MinicrmResponse> {
        throw new Error("timeout");
      }
    }
    const b = new ThrowingBackend(cfg(), async () => {});
    await assert.rejects(
      () => b.request({ method: "GET", pathname: "/Api/R3/Category" }),
      /timeout/
    );
  });
});
