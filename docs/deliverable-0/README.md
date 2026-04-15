# Deliverable 0 — Schema discovery (Phase 1)

Assemble **Deliverable 0** for milestone **M1** per `docs/Teszt-Projekt-MCP.md` and `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`.

**Master checklist:** `PHASE-BY-PHASE-CHECKLIST.md`  
**What to show the product owner for M1 sign-off:** `M1-PRODUCT-OWNER-SIGNOFF.md` + `PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md`  
**One-week parallel plan:** `ONE-WEEK-PARALLEL-TRACK-PLAN.md`  
**Engineering QA (internal):** `INTERNAL-QA-CHECKLIST.md`  
**Stakeholder summary (1 page):** `EXECUTIVE-SUMMARY-M1.md`

## Frozen artefacts (2026-04-13)

| File | Status |
|------|--------|
| `mcp-tool-contracts.md` | **v1.0-live** — all 12 tools, Inputs/Outputs/Errors |
| `crm-structure-map.md` | Pilot tenant snapshot — **replace** CategoryId tables if client tenant differs |
| `api-samples/` + `api-test-log.md` | Evidence library + request log |
| `api-discrepancies.md` | Live vs manual (ToDo PUT, list/detail types, …) |
| `UAT-SCRIPT-8-10-PROMPTS.md` | Tenant-safe prompts (no hard-coded `Project/3` for live) |
| `PILOT-EXECUTION-LOG.md` | **Fill** during formal pilot (pass %, approver) |
| `TOOL-FUNCTIONAL-MATRIX.md` | Maps tools → UT / smoke / pilot evidence |
| `LIVE-429-VERIFICATION.md` | Unit-test evidence for 429 backoff; live flood optional |
| `docs/prompts/system-prompt.md` | Hungarian Claude Project prompt (frozen) |

## Still human-driven

- **M1 / M2 / M3 sign-off** rows in `PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md`
- **`environment-notes.md`**, **`technical-design-phase1.md`**: confirm PO/engineering reviewed for your org
- **Clean-machine verification** (optional): follow `CLAUDE-DESKTOP-SETUP.md` §6–7 on a fresh PC

## Code artefact

- `minicrm-mcp-server/` — run `npm run build`, `npm test`, `npm run smoke:api` (live) / `smoke:tools:mock` (offline)

## Gate M1

Per process: obtain **product owner approval** on Deliverable 0 before treating M1 as formally closed — see `M1-PRODUCT-OWNER-SIGNOFF.md` §5.
