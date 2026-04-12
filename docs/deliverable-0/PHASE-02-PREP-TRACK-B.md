# Phase 2 prep — Track B (before / parallel to M1)

**Source:** `docs/phases/Phase-02-MCP-Server-and-Twelve-Tools.md`  
**Purpose:** Track what is already implemented vs what Phase 2 still requires after M1. Does **not** replace M1 or frozen contracts.

**Formal Phase 2 start:** runbook requires **P2.1–P2.6** (M1 signed, contracts frozen, ToDo method verified, `.env`, etc.).

---

## Checklist (living)

| Phase-02 theme | Runbook ref. | Status (this repo) | Notes |
|----------------|--------------|--------------------|--------|
| Repo hygiene | Step 1 | **Partial** | `.gitignore`, `.env.example`, README; add `npm test` to README |
| Config module | Step 2 | **Done (mock+live)** | `config.ts`, dotenv, validate live credentials |
| HTTP client | Step 3 | **Partial** | `real-backend.ts` Basic + JSON; live errors use `uzenetHu` via `errors.ts`; **429** retry + backoff in `real-backend.ts` |
| Rate limiter | Step 4 | **Partial** | Sliding window 60/min; **ConcurrencyGate** (default 4); invoice-specific counting **TBD** |
| Logging | Step 5 | **Partial** | stderr JSON per tool HTTP (`log.ts`); `MINICRM_DEBUG_HTTP`; empty-list hint (`empty-results.ts`) |
| 12 tools | Step 5–6 | **Done (handlers)** | `register-crm-tools.ts`; align with **frozen** contracts after M1 |
| `projekt_statusz_valtas` | Step 7.d | **Done** | Body only `{ StatusId }`; covered by `project-status.test.ts` |
| Unit tests | Step 9 | **Started** | `npm test` — helpers + `errors`, `empty-results`, `concurrency-gate`; **not** yet per-tool handler mocks |
| Integration / smoke | — | **Partial** | `scripts/smoke-api.mjs` (GET); `npm run smoke:tools:mock` (12 paths on fixtures); Claude Desktop = optional UX pass |

---

## Unit tests (Track B)

| File | Covers |
|------|--------|
| `minicrm-mcp-server/src/minicrm/search-params.test.ts` | GET query building |
| `minicrm-mcp-server/src/minicrm/ids.test.ts` | Path id coercion |
| `minicrm-mcp-server/src/minicrm/project-status.test.ts` | Status-only body |
| `minicrm-mcp-server/src/minicrm/errors.test.ts` | HU messages + error payload shape |
| `minicrm-mcp-server/src/minicrm/empty-results.test.ts` | Empty list note |
| `minicrm-mcp-server/src/minicrm/concurrency-gate.test.ts` | Parallel cap |

**Command:** `npm test` (from `minicrm-mcp-server/`).

---

## After M1 (Track A catches up)

1. Extend tests from **real** error payloads (400/404/429) and add **per-tool** handler tests (Phase-02 Step 9).  
2. Confirm **ToDo create** method matches Phase-01 Step 4.8 and adjust `teendo_letrehozas` if needed.  
3. Re-read Phase-02 Steps 8+ (input validation hardening, M2 gate) when approaching **M2**.
