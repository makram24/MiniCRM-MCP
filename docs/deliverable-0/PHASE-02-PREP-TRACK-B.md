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
| HTTP client | Step 3 | **Partial** | `real-backend.ts` Basic + JSON; structured HU errors / 429 backoff **TBD** |
| Rate limiter | Step 4 | **Done (basic)** | Sliding window 60/min; invoice-specific counting **TBD** |
| 12 tools | Step 5–6 | **Done (handlers)** | `register-crm-tools.ts`; align with **frozen** contracts after M1 |
| `projekt_statusz_valtas` | Step 7.d | **Done** | Body only `{ StatusId }`; covered by `project-status.test.ts` |
| Unit tests | Step / §1 | **Started** | `npm test` — `search-params`, `ids`, `project-status` |
| Integration / smoke | — | **Partial** | `scripts/smoke-api.mjs` (GET); MCP mock exercise = manual / Desktop |

---

## Unit tests (Track B)

| File | Covers |
|------|--------|
| `minicrm-mcp-server/src/minicrm/search-params.test.ts` | GET query building |
| `minicrm-mcp-server/src/minicrm/ids.test.ts` | Path id coercion |
| `minicrm-mcp-server/src/minicrm/project-status.test.ts` | Status-only body |

**Command:** `npm test` (from `minicrm-mcp-server/`).

---

## After M1 (Track A catches up)

1. Extend tests from **real** error payloads (400/404/429).  
2. Implement **429 backoff** + structured `messageHu` per contracts.  
3. Confirm **ToDo create** method matches Phase-01 Step 4.8 and adjust `teendo_letrehozas` if needed.  
4. Re-read Phase-02 Steps 8+ (logging, security, M2 gate) when approaching **M2**.
