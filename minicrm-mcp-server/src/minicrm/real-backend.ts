import https from "node:https";
import { URL } from "node:url";

import type { MinicrmConfig } from "../config.js";
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

export class RealMinicrmBackend implements MinicrmBackend {
  private readonly limiter: RateLimiter;
  private readonly authHeader: string;

  constructor(private readonly cfg: MinicrmConfig) {
    this.limiter = new RateLimiter(cfg.rateLimitPerMinute);
    const token = Buffer.from(`${cfg.systemId}:${cfg.apiKey}`, "utf8").toString(
      "base64"
    );
    this.authHeader = `Basic ${token}`;
  }

  async request(req: MinicrmRequest): Promise<MinicrmResponse> {
    await this.limiter.acquire();
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
      if (bodyStr !== undefined) clientReq.write(bodyStr);
      clientReq.end();
    });
  }
}
