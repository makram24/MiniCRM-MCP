# Internal QA checklist — pre M1 / M2 / M3 gates

**Completed:** `2026-04-13` (engineering sign-off on evidence in repo).  
**Product owner sign-off:** use `M1-PRODUCT-OWNER-SIGNOFF.md` + `PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md`.

Legend: `[x]` satisfied, `[ ]` needs human approver outside repo.

---

## A. Connectivity and credentials

- [x] `GET /Api/R3/Category` returns **200** with valid Basic auth (`npm run smoke:api`).
- [x] **401** root causes documented (wrong/expired API key; `.env` vs Desktop `env`; subscription add-on).
- [x] **ToDo create** method verified on tenant: **PUT** accepted, **POST** → **405** (`api-samples/08-todo-probe-*.json`, `api-discrepancies.md`).

---

## B. Samples and logs

- [x] `docs/deliverable-0/api-samples/` contains category, schema, project list/detail, todo list, contact search/detail, invoice list, todo probes.
- [x] `api-test-log.md` rows match saved samples.
- [x] `api-discrepancies.md` lists live vs manual deltas affecting tools.

---

## C. Contracts and code alignment

- [x] `mcp-tool-contracts.md` **v1.0-live** — all **12** tools have Inputs / Outputs / Errors (no critical TBD).
- [x] MCP tool parameter names match `minicrm-mcp-server/src/crm-tools.ts` Zod schemas.
- [x] Invoice path aligned: `GET /Api/Invoice/List`.

---

## D. Automated tests

- [x] `npm test` passes in `minicrm-mcp-server` (mock + HTTP wrapper tests including 429 simulation).
- [x] `npm run smoke:tools:mock` passes.

---

## E. Claude Desktop transport

- [x] Stdout MCP-safe (`dotenv` quiet; no stray prints on stdio).
- [x] `CLAUDE-DESKTOP-SETUP.md` documents MSIX vs Roaming paths, wrapper script, first-run tests.
- [ ] **Approver:** Final “quit Claude fully → reopen → 12 tools visible” logged in `PILOT-EXECUTION-LOG.md` *Approver row* (optional name/date).

---

## F. Pilot and UAT

- [x] `UAT-SCRIPT-8-10-PROMPTS.md` updated for tenant-safe CategoryId / Ids.
- [x] `PILOT-EXECUTION-LOG.md` created with pass/fail table (fill dates/approver as you run).
- [x] `TOOL-FUNCTIONAL-MATRIX.md` maps tools → evidence.

---

## G. Rate limit / 429

- [x] Code: retry with backoff on **429** (`RealMinicrmBackend` + unit tests).
- [x] **Live** forced 429 not required for gate — documented in `LIVE-429-VERIFICATION.md`.

---

## Outcome

**Internal QA:** **PASS** (engineering) on `2026-04-13`.  
**M1 PO sign-off / M3 ≥90% pilot:** pending stakeholder execution of templates in this folder.
