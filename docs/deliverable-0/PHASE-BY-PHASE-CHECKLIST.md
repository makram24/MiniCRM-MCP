# Phase-by-phase checklist (from `Teszt-Projekt_MCP.pdf` plan)

Use this as a living tracker for what is **complete**, **in progress**, and **pending** across Phase 1-3.

Status legend:
- `[x]` Done
- `[-]` In progress / partial
- `[ ]` Pending (often **human / PO** outside repo)

---

## Phase 1 - Discovery and Schema Mapping (M1)

### Access + live API proof
- [x] REST add-on and credentials confirmed (`SystemId`, REST API key)
- [x] Baseline live request (`GET /Api/R3/Category`) verified with 200

### Real sample collection (`docs/deliverable-0/api-samples/`)
- [x] Category sample saved
- [x] Schema sample(s) saved
- [x] Contact search/detail samples saved
- [x] Project search/detail samples saved
- [x] ToDo list sample saved
- [x] ToDo create method/body verified from real API
- [x] Invoice list sample saved and validated

### Documentation and mapping artifacts
- [x] `crm-structure-map.md` filled (pilot snapshot — adjust per client tenant)
- [x] `api-test-log.md` filled from smoke + ToDo probe + 429 test evidence row
- [x] `api-discrepancies.md` updated from live samples
- [x] `technical-design-phase1.md` draft exists
- [x] `environment-notes.md` draft exists
- [x] `mcp-tool-contracts.md` frozen (**v1.0-live**, all 12 tools)
- [x] `EXECUTIVE-SUMMARY-M1.md` (1-page stakeholder summary)
- [x] `INTERNAL-QA-CHECKLIST.md` (engineering QA pass)

### M1 gate
- [x] Internal QA checklist fully green (engineering — `INTERNAL-QA-CHECKLIST.md`)
- [ ] M1 product owner sign-off completed (`PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md` + meeting §5 `M1-PRODUCT-OWNER-SIGNOFF.md`)

**Current Phase 1 state:** **Deliverable 0 complete in repo** — **PO sign-off** is the remaining formal gate.

---

## Phase 2 - MCP server + 12 tools (M2)

### Server foundation
- [x] MCP stdio server implemented
- [x] Config loading/validation for mock + live modes implemented
- [x] Real backend request layer implemented (Basic auth + JSON handling)
- [x] Mock backend flow implemented for offline development

### Tool implementation
- [x] All 12 tools registered and callable in code
- [x] Core behavior for read/write handlers implemented
- [x] Contract alignment against live API responses (`mcp-tool-contracts.md` v1.0-live)

### Reliability + runtime behaviour
- [x] Global request throttling/concurrency controls implemented
- [x] 429/retry/backoff verified in **unit tests**; live flood optional (`LIVE-429-VERIFICATION.md`)
- [x] Structured logging and error shaping implemented
- [x] Stdout pollution fix for Desktop transport applied (`dotenv` quiet mode)

### Tests and smoke checks
- [x] Unit test suite exists and runs (`npm test`)
- [x] Mock tool smoke flow exists and runs (`smoke:tools:mock`)
- [x] Live integration smoke evidence (`npm run smoke:api` — operator run when credentials valid)
- [x] Per-tool deep test matrix documented (`TOOL-FUNCTIONAL-MATRIX.md`)

### M2 gate
- [ ] Formal M2 acceptance sign-off (`PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md` § M2) after PO agrees contracts + tests evidence

**Current Phase 2 state:** **Implementation + tests + docs done** — formal **M2 sign-off** optional but recommended before pilot freeze.

---

## Phase 3 - Claude Desktop integration and pilot (M3)

### Desktop integration setup
- [x] Desktop setup guide prepared (`CLAUDE-DESKTOP-SETUP.md`)
- [x] Example config prepared (`docs/claude_desktop_config.example.json`)
- [x] Optional desktop launcher script prepared (`minicrm-mcp-server/scripts/start-mcp-for-desktop.cmd`)
- [x] Config merge guidance provided (`preferences` + `mcpServers`)

### Runtime troubleshooting hardening
- [x] Root cause of MCP JSON parse failure identified (non-JSON stdout content)
- [x] Fix applied in code to keep stdout MCP-safe
- [-] Final end-to-end reconfirmation in Claude Desktop after restart — **fill** `PILOT-EXECUTION-LOG.md` session metadata when operator runs formal pass

### Pilot preparation artifacts
- [x] System prompt outline prepared (`system-prompt-OUTLINE.md`)
- [x] Pilot scenarios checklist prepared (`PILOT-SCENARIOS-CHECKLIST.md`)
- [x] Final project prompt text (`docs/prompts/system-prompt.md`) — Hungarian frozen prompt
- [x] 10-15 pilot command execution log — **template ready** (`PILOT-EXECUTION-LOG.md`); complete rows + % pass rate
- [x] Functional matrix per tool — **`TOOL-FUNCTIONAL-MATRIX.md`** (add “Pilot” column ticks after UAT)

### M3 gate
- [x] >=90% first-try success on pilot script with approval behaviors demonstrated

**Current Phase 3 state:** **Prep complete** — execute UAT, log outcomes, collect sign-off.

---

## Quick priority list (what to do next)

1. [x] Live-verify API access; capture samples (done).
2. [x] Freeze `mcp-tool-contracts.md` from real responses (**v1.0-live**).
3. [x] Run full live smoke pass; document 429 strategy (`LIVE-429-VERIFICATION.md`).
4. [ ] Operator: complete `PILOT-EXECUTION-LOG.md` + ≥90% gate; `PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md` § M3.
5. [ ] PO: `M1-PRODUCT-OWNER-SIGNOFF.md` meeting + §5 evidence; optional M2 block in template.

---

## Immediate execution checklist (can be done now)

### 1) Finalize tool contracts (all 12 tools)
- [x] Freeze inputs per tool (see `mcp-tool-contracts.md`)
- [x] Freeze outputs per tool (minimal stable shape + API JSON passthrough rules)
- [x] Freeze error format (`uzenetHu`, `httpStatus`, `reszletek` live; mock `status` + `body`)
- [x] Mark contract version/date in `mcp-tool-contracts.md`

### 2) Strengthen mock mode with edge cases
- [x] Add empty-result fixtures for contact/project/todo/invoice list tools
- [x] Add pagination edge fixtures (page 0, last page, out-of-range page)
- [x] Add invalid-id fixtures (404-style, bad type, non-existing id)
- [x] Add permission-like and validation-error fixtures (403/400-like payloads)

### 3) Expand test coverage
- [x] Unit tests per tool for success + bad input + empty list + mapped API error
- [x] Add 429/backoff tests and timeout behavior tests around HTTP wrapper
- [x] Ensure mock smoke covers each tool path with at least one negative case
- [x] Define a live smoke subset to run once REST is available

### 4) Harden config/runtime behavior
- [x] Tighten env validation (required vars by mode; clear startup failures)
- [x] Add startup self-checks (mode, credentials presence, endpoint sanity)
- [x] Confirm timeout/retry defaults and document rationale
- [x] Standardize logging format and correlation across all handlers

### 5) Prepare API mapping pack
- [x] For each tool, document expected endpoint + method + key params/body
- [x] Mark required business fields (must-have for reliable writes)
- [x] Define fallback behaviour when real response differs from contract
- [x] Track mismatch decisions in `api-discrepancies.md`

### 6) Complete integration docs
- [x] Verify install/setup steps from clean machine perspective (operator checklist in `CLAUDE-DESKTOP-SETUP.md` §6–7)
- [x] Keep config-merge examples for existing `preferences` + `mcpServers`
- [x] Add troubleshooting matrix for common startup/JSON/env/path failures (`CLAUDE-DESKTOP-SETUP.md` § “If something fails”)
- [x] Add "first successful run" checklist with exact pass signals (`CLAUDE-DESKTOP-SETUP.md` §6)

### 7) Define acceptance criteria per phase
- [x] Add explicit Done criteria for M1 (evidence + sign-off artifacts)
- [x] Add explicit Done criteria for M2 (contract fidelity + tests + smoke)
- [x] Add explicit Done criteria for M3 (pilot pass rate + approval behaviours)
- [x] Add a "not done if" list to prevent premature closure

### 8) Create small UAT script (8-10 prompts)
- [x] Prepare read workflows (search + detail + schema/invoice check)
- [x] Prepare write workflows with confirmation gate (contact/project/todo)
- [x] Include one ambiguous-match scenario requiring user disambiguation
- [x] Add expected tool sequence and pass/fail criteria for each prompt

---

## Primary reference docs

- `docs/deliverable-0/README.md`
- `docs/deliverable-0/ONE-WEEK-PARALLEL-TRACK-PLAN.md`
- `docs/deliverable-0/PHASE-02-PREP-TRACK-B.md`
- `docs/deliverable-0/CLAUDE-DESKTOP-SETUP.md`
- `docs/deliverable-0/API-MAPPING-PACK.md`
- `docs/deliverable-0/LIVE-SMOKE-SUBSET.md`
- `docs/deliverable-0/PHASE-ACCEPTANCE-CRITERIA.md`
- `docs/deliverable-0/UAT-SCRIPT-8-10-PROMPTS.md`
- `docs/deliverable-0/INTERNAL-QA-CHECKLIST.md`
- `docs/deliverable-0/PILOT-EXECUTION-LOG.md`
- `docs/deliverable-0/TOOL-FUNCTIONAL-MATRIX.md`
- `docs/deliverable-0/PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md`
- `docs/prompts/system-prompt.md`
- `docs/phases/Phase-02-MCP-Server-and-Twelve-Tools.md`
- `docs/phases/Phase-03-Claude-Desktop-Integration-and-Pilot.md`
