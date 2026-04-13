import https from "node:https";
import { URL } from "node:url";

import type { MinicrmConfig } from "../config.js";
import { ConcurrencyGate } from "./concurrency-gate.js";
import { RateLimiter } from "./rate-limiter.js";
import type { MinicrmBackend, MinicrmRequest, MinicrmResponse } from "./types.js";

function fullUrl(base: string, pathname: string, search?: string): URL {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const q =
    search && search.length > 0
      ? search.startsWith("?")
        ? search
        : `?${search}`
      : "";
  const baseForResolve = base.endsWith("/") ? base : `${base}/`;
  return new URL(path + q, baseForResolve);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Phase-02 Step 4.4 — exponential backoff + jitter (cap 30s). */
export function backoffMs(attemptIndex: number): number {
  const base = 500;
  const cap = 30_000;
  const exp = Math.min(cap, base * 2 ** attemptIndex);
  const jitter = Math.floor(Math.random() * 250);
  return exp + jitter;
}

export class RealMinicrmBackend implements MinicrmBackend {
  private readonly limiter: RateLimiter;
  private readonly gate: ConcurrencyGate;
  private readonly authHeader: string;

  constructor(
    private readonly cfg: MinicrmConfig,
    private readonly sleepFn: (ms: number) => Promise<void> = sleep
  ) {
    this.limiter = new RateLimiter(cfg.rateLimitPerMinute);
    this.gate = new ConcurrencyGate(cfg.maxConcurrentRequests);
    const token = Buffer.from(`${cfg.systemId}:${cfg.apiKey}`, "utf8").toString(
      "base64"
    );
    this.authHeader = `Basic ${token}`;
  }

  async request(req: MinicrmRequest): Promise<MinicrmResponse> {
    let last: MinicrmResponse = { status: 0, bodyText: "" };
    for (let attempt = 0; attempt <= this.cfg.max429Retries; attempt++) {
      await this.limiter.acquire();
      await this.gate.acquire();
      try {
        last = await this.rawHttps(req);
      } finally {
        this.gate.release();
      }

      if (last.status !== 429 || attempt >= this.cfg.max429Retries) {
        break;
      }
      await this.sleepFn(backoffMs(attempt));
    }

    if (this.cfg.debugHttp && last.bodyText.length > 0) {
      const preview = last.bodyText.slice(0, 500).replace(/\s+/g, " ");
      console.error(
        `[MINICRM_DEBUG_HTTP] ${req.method} ${req.pathname} → ${last.status} len=${last.bodyText.length} ${preview}${last.bodyText.length > 500 ? "…" : ""}`
      );
    }

    return last;
  }

  protected rawHttps(req: MinicrmRequest): Promise<MinicrmResponse> {
    const u = fullUrl(this.cfg.baseUrl, req.pathname, req.search);
    const bodyStr =
      req.body !== undefined && req.body !== null
        ? JSON.stringify(req.body)
        : undefined;

    return new Promise((resolve, reject) => {
      const opts: https.RequestOptions = {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: req.method,
        headers: {
          Authorization: this.authHeader,
          Accept: "application/json",
          ...(bodyStr !== undefined
            ? { "Content-Type": "application/json; charset=utf-8" }
            : {}),
        },
      };

      const clientReq = https.request(opts, (res) => {
        let data = "";
        res.on("data", (c) => {
          data += c;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode ?? 0, bodyText: data });
        });
      });
      clientReq.on("error", reject);
      clientReq.setTimeout(this.cfg.requestTimeoutMs, () => {
        clientReq.destroy(
          new Error(
            `miniCRM kérés timeout (${this.cfg.requestTimeoutMs} ms): ${req.method} ${req.pathname}`
          )
        );
      });
      if (bodyStr !== undefined) clientReq.write(bodyStr);
      clientReq.end();
    });
  }
}
