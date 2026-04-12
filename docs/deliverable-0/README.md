# Deliverable 0 — Schema discovery (Phase 1)

Assemble **Deliverable 0** for milestone **M1** per `docs/Teszt-Projekt-MCP.md` and `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`.

**Checklist of open Phase 1 work:** `PHASE-1-REMAINING.md`  
**What to show the product owner for M1 sign-off:** `M1-PRODUCT-OWNER-SIGNOFF.md`  
**One-week parallel plan (Track A: REST/client, Track B: offline):** `ONE-WEEK-PARALLEL-TRACK-PLAN.md`

## What to fill in (you / stakeholder)

**Track B1 started:** `crm-structure-map.md`, `api-test-log.md`, `api-discrepancies.md`, `technical-design-phase1.md`, and `environment-notes.md` exist as **drafts** (structure + placeholders). `mcp-tool-contracts.md` includes **HU** “Felhasználó felé” lines; **Inputs/Outputs/Errors** stay TBD until live `api-samples/`.

**Track B2 (dev prep):** `PHASE-02-PREP-TRACK-B.md` + `minicrm-mcp-server` → `npm test` (query params, id coercion, status-only body).

| File | Action |
|------|--------|
| `crm-structure-map.md` | Fill from UI: modules (CategoryId), statuses, custom fields, Hungarian glossary |
| `api-samples/` | Create folder; save raw JSON from each smoke test (see Phase-01 Step 4) |
| `api-test-log.md` | One row per request: URL, method, status, sample file name |
| `api-discrepancies.md` | Differences vs `docs/MiniCRM-Integrations-Manual.md` |
| `mcp-tool-contracts.md` | Complete **Inputs / Outputs / Errors** for all 12 tools from real JSON |
| `technical-design-phase1.md` | Rate limiter design, logging rules, repo layout |
| `environment-notes.md` | Node, curl, Claude Desktop version, date |

## Code artefact

- Git commit / tag of `minicrm-mcp-server/` **Phase 1 stub** (toolchain only).

## Gate M1

Do **not** start Phase 2 implementation until the client approves this package (**sign-off**).
