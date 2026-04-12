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
- **Future (Phase 2):** optional structured log on stderr: tool name, HTTP status, duration; still no full API key or full bodies without policy.

---

## 4. Rate limiting (implemented for live mode)

- **Mechanism:** sliding window in `minicrm-mcp-server/src/minicrm/rate-limiter.ts` — max N calls per rolling 60s (`N` = `MINICRM_RATE_LIMIT_PER_MINUTE`, default **60** per Integrations Manual).
- **Scope:** applied in `RealMinicrmBackend` before each HTTPS request; **mock mode** does not consume quota.
- **429:** *TBD after live observation* — retry with backoff + jitter; max retries to be decided (Phase 2 hardening).
- **Invoice:** manual notes separate limits for invoice endpoints — *confirm counting strategy when pilot hits invoice-heavy flows*.

---

## 5. Burst / concurrency

- Current implementation: **sequential** `await` per tool call; one outbound request per handler except `schema_lekerdezes` (**2** GETs: Category + Schema).
- **Max parallel outbound:** *TBD* if Claude chains many tools; consider global limiter already caps average rate.

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
