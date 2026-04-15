# Phase sign-off — evidence template (M1 / M2 / M3)

Copy this section to email, ticket, or meeting minutes. **Do not commit secrets** (API keys, PII).

---

## M1 — Discovery / Deliverable 0

**Approver:** _______________________ **Date:** __________

**Outcome:** ☐ Approved ☐ Approved with actions ☐ Not approved

**Artefacts reviewed** (tick):

- ☐ `crm-structure-map.md`
- ☐ `api-samples/` + `api-test-log.md`
- ☐ `api-discrepancies.md`
- ☐ `mcp-tool-contracts.md` (v1.0-live)
- ☐ `technical-design-phase1.md` + `environment-notes.md`

**Actions / change requests (if any):**

---

## M2 — MCP server implementation

**Approver:** _______________________ **Date:** __________

**Outcome:** ☐ Approved ☐ Approved with actions ☐ Not approved

**Evidence:**

- ☐ `npm test` green (record Node version in `environment-notes.md`)
- ☐ `npm run smoke:tools:mock` green
- ☐ `npm run smoke:api` green on approved tenant (screenshot or CI log path): __________
- ☐ Contracts match code (`mcp-tool-contracts.md` version): __________

**Notes:**

---

## M3 — Claude Desktop pilot

**Approver:** _______________________ **Date:** __________

**Outcome:** ☐ Approved ☐ Approved with actions ☐ Not approved

**Pilot metrics** (from `PILOT-EXECUTION-LOG.md`):

- First-try success: _____ / 10 = _____ % (target ≥ 90%)
- Write prompts respected confirm-before-execute: ☐ Yes ☐ No

**Attachments:** links to screenshots / redacted logs: __________

---

## References

- `M1-PRODUCT-OWNER-SIGNOFF.md`
- `PHASE-ACCEPTANCE-CRITERIA.md`
- `PHASE-BY-PHASE-CHECKLIST.md`
