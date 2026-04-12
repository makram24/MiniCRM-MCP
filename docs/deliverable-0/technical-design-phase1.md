# Technical design — Phase 1

**Status:** *Track B1 — váz a jelenlegi repo alapján; finomítás M1 előtt élő 429 / hibakódok ismeretében.*  
**Phase-01:** Step 8. **Scope:** `docs/Teszt-Projekt-MCP.md` (60 req/min, Basic auth).

---

## 1. Repository layout (actual)

```
ASP Engeneering Test/
  docs/
    deliverable-0/          # Deliverable 0, phase runbooks, Integrations Manual
    phases/
  minicrm-mcp-server/
    src/
      index.ts              # stdio MCP, dotenv, register tools
      config.ts             # MINICRM_* env
      register-crm-tools.ts # 12 tool handlers
      minicrm/
        types.ts
        factory.ts          # mock vs real backend
        mock-backend.ts     # fixtures
        real-backend.ts     # https + Basic auth
        rate-limiter.ts
        search-params.ts    # GET query string (unit tested)
        ids.ts              # path id coercion (unit tested)
        project-status.ts   # StatusId-only body helper (unit tested)
        errors.ts           # HTTP → Hungarian `uzenetHu` (Phase 2)
        empty-results.ts    # “Nincs találat” append on list responses
        concurrency-gate.ts # parallel HTTPS cap (live)
        log.ts              # stderr JSON tool / timing / status
        *.test.ts           # excluded from tsc emit; run via npm test
    fixtures/               # mock JSON (nem tenant-specifikus)
    scripts/smoke-api.mjs   # GET smoke, SMOKE_SAVE, DEBUG_SMOKE
    dist/                   # tsc output
```

---

## 2. Configuration (`.env`)

| Variable | Purpose |
|----------|---------|
| `MINICRM_USE_MOCK` | `true` / `1` / `yes` → fixture backend, no credentials required |
| `MINICRM_SYSTEM_ID` | Basic auth **username** (live) |
| `MINICRM_API_KEY` | Basic auth **password** — REST API key (live) |
| `MINICRM_BASE_URL` | Default `https://r3.minicrm.hu` |
| `MINICRM_RATE_LIMIT_PER_MINUTE` | Default `60` (live outbound only) |

Secrets: only in `.env`; `.gitignore` covers `.env`. **Never** log key or raw PII on stdout (MCP uses stdout).

---

## 3. Logging

- **Allowed:** `console.error` for fatal startup (e.g. missing credentials in live mode).
- **MCP:** JSON-RPC on **stdio** — no debug `console.log` to stdout in production use.
- **Phase 2 (live default):** one JSON line per HTTP call on **stderr**: `tool`, `ms`, `status`, `path` (`minicrm/log.ts`). Mock: off unless `MINICRM_LOG_TOOLS=1`; disable live logs with `MINICRM_LOG_TOOLS=0`.
- **Debug:** `MINICRM_DEBUG_HTTP=true` — truncated response preview on stderr (no secrets).

---

## 4. Rate limiting (implemented for live mode)

- **Mechanism:** sliding window in `minicrm-mcp-server/src/minicrm/rate-limiter.ts` — max N calls per rolling 60s (`N` = `MINICRM_RATE_LIMIT_PER_MINUTE`, default **60** per Integrations Manual).
- **Scope:** applied in `RealMinicrmBackend` on **each** HTTP attempt (including **429** retries); **mock mode** does not use the real client.
- **429:** exponential backoff + jitter (cap 30s), up to **`MINICRM_MAX_429_RETRIES`** (default **3**) after the first response — see `real-backend.ts`.
- **Invoice:** manual notes separate limits for invoice endpoints — *confirm counting strategy when pilot hits invoice-heavy flows*.

---

## 5. Burst / concurrency

- **`ConcurrencyGate`** (`minicrm/concurrency-gate.ts`): max **`MINICRM_MAX_CONCURRENT`** parallel HTTPS calls (default **4**) around each raw request in live mode.
- Per MCP tool, handlers are still mostly one call; `schema_lekerdezes` issues two sequential calls (each passes through limiter + gate).

---

## 6. MCP SDK

- **Package:** `@modelcontextprotocol/sdk`
- **Transport:** `StdioServerTransport` (Claude Desktop)
- **Tools:** `McpServer.registerTool` + Zod `inputSchema` (`register-crm-tools.ts`)

---

## 7. Testing (Phase 2 target)

- **Unit (Track B — started):** `npm test` in `minicrm-mcp-server` — `buildSearchParamsString`, `coerceRecordId`, `normalizeStatusIdForBody` / status-only body shape. See `docs/deliverable-0/PHASE-02-PREP-TRACK-B.md`.
- **Integration:** optional suite behind env flag with real credentials (non-CI).
- **Smoke:** `npm run smoke:api` in `minicrm-mcp-server` (GET-only script; extend for PUT/POST as needed).

---

## 8. Mock vs live switch

Documented in `minicrm-mcp-server/MOCK-AND-LIVE-REST.md` and `minicrm-mcp-server/README.md`.
