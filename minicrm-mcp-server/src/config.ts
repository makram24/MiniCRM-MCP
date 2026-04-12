import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type MinicrmConfig = {
  useMock: boolean;
  baseUrl: string;
  systemId: string;
  apiKey: string;
  rateLimitPerMinute: number;
  /** Phase-02 Step 4.5 — parallel HTTPS cap (live). */
  maxConcurrentRequests: number;
  /** Phase-02 Step 4.4 — retries after HTTP 429 (live). */
  max429Retries: number;
  /** Phase-02 Step 5.3 — log truncated response bodies on stderr. */
  debugHttp: boolean;
  /** Absolute path to `fixtures/` (for mock mode). */
  fixturesDir: string;
};

function truthyEnv(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

function readEnv(): MinicrmConfig {
  const useMock = truthyEnv(process.env.MINICRM_USE_MOCK);
  const baseUrl = (process.env.MINICRM_BASE_URL || "https://r3.minicrm.hu").replace(
    /\/$/,
    ""
  );
  const systemId = (process.env.MINICRM_SYSTEM_ID || "").trim();
  const apiKey = (process.env.MINICRM_API_KEY || "").trim();
  const rateRaw = process.env.MINICRM_RATE_LIMIT_PER_MINUTE;
  const rateLimitPerMinute =
    rateRaw !== undefined && rateRaw !== ""
      ? Math.max(1, parseInt(rateRaw, 10) || 60)
      : 60;

  const concurrentRaw = process.env.MINICRM_MAX_CONCURRENT;
  const maxConcurrentRequests =
    concurrentRaw !== undefined && concurrentRaw !== ""
      ? Math.max(1, parseInt(concurrentRaw, 10) || 4)
      : 4;

  const retry429Raw = process.env.MINICRM_MAX_429_RETRIES;
  const max429Retries =
    retry429Raw !== undefined && retry429Raw !== ""
      ? Math.max(0, parseInt(retry429Raw, 10) || 3)
      : 3;

  const debugHttp = truthyEnv(process.env.MINICRM_DEBUG_HTTP);

  const fixturesDir = path.resolve(__dirname, "../fixtures");

  return {
    useMock,
    baseUrl,
    systemId,
    apiKey,
    rateLimitPerMinute,
    maxConcurrentRequests,
    max429Retries,
    debugHttp,
    fixturesDir,
  };
}

export function loadMinicrmConfig(): MinicrmConfig {
  return readEnv();
}

export function validateConfigForStartup(cfg: MinicrmConfig): void {
  if (!cfg.useMock && (!cfg.systemId || !cfg.apiKey)) {
    console.error(
      "miniCRM: éles módhoz MINICRM_SYSTEM_ID és MINICRM_API_KEY kötelező (.env), " +
        "vagy állítsd MINICRM_USE_MOCK=true-ra a fejlesztői fixtúrákhoz."
    );
    process.exit(1);
  }
}
