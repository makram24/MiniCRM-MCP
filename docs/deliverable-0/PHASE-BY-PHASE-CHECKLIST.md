# Phase-by-phase checklist (from `Teszt-Projekt_MCP.pdf` plan)

Use this as a living tracker for what is **complete**, **in progress**, and **pending** across Phase 1-3.

Status legend:
- `[x]` Done
- `[-]` In progress / partial
- `[ ]` Pending

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
- [x] `crm-structure-map.md` scaffold exists
- [x] `api-test-log.md` filled from smoke + ToDo probe
- [x] `api-discrepancies.md` updated from live samples
- [x] `technical-design-phase1.md` draft exists
- [x] `environment-notes.md` draft exists
- [-] `mcp-tool-contracts.md` partly prepared (ToDo PUT + minták; többi tool I/O még bővíthető)

### M1 gate
- [ ] Internal QA checklist fully green
- [ ] M1 product owner sign-off completed

Current Phase 1 state: **In progress** (élő minták + napló kész; M1 belső QA + PO sign-off hátra van).

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
- [-] Final contract alignment against live API responses pending after Phase 1 samples

### Reliability + runtime behavior
- [x] Global request throttling/concurrency controls implemented
- [-] Full 429/retry/backoff verification against live behavior still pending
- [x] Structured logging and error shaping implemented
- [x] Stdout pollution fix for Desktop transport applied (`dotenv` quiet mode)

### Tests and smoke checks
- [x] Unit test suite exists and runs (`npm test`)
- [x] Mock tool smoke flow exists and runs (`smoke:tools:mock`)
- [-] Live integration smoke evidence still depends on real API access
- [x] Per-tool deep test matrix (success/input-error/empty/429 for all tools) can be expanded

### M2 gate
- [ ] Full M2 acceptance run with frozen contracts and live-verified behavior

Current Phase 2 state: **Mostly implemented, pending final live verification + acceptance closure**.

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
- [ ] Final end-to-end reconfirmation in Claude Desktop after restart (tools visible + stable calls)

### Pilot preparation artifacts
- [x] System prompt outline prepared (`system-prompt-OUTLINE.md`)
- [x] Pilot scenarios checklist prepared (`PILOT-SCENARIOS-CHECKLIST.md`)
- [ ] Final project prompt text (`docs/prompts/system-prompt.md`) finalized from real CRM mapping
- [ ] 10-15 pilot command execution log completed
- [ ] Functional matrix per tool (success/failure evidence) completed

### M3 gate
- [ ] >=90% first-try success on pilot script with approval behaviors demonstrated

Current Phase 3 state: **Prepared and partially validated; pilot execution still pending**.

---

## Quick priority list (what to do next)

1. [ ] Unblock/live-verify API access and capture real samples (Phase 1 critical path).
2. [ ] Freeze `mcp-tool-contracts.md` from real responses.
3. [ ] Run full live smoke pass and close remaining Phase 2 verification gaps.
4. [ ] Reconfirm Desktop stability + run pilot script and log outcomes (Phase 3 gate work).
5. [ ] Collect M1 -> M2 -> M3 formal sign-off evidence.

---

## Immediate execution checklist (can be done now)

### 1) Finalize tool contracts (all 12 tools)
- [-] Freeze inputs per tool (required/optional fields, types, enums, unknown-field policy)
- [-] Freeze outputs per tool (minimal stable shape + optional fields)
- [x] Freeze error format (`code`, `httpStatus`, `messageHu`, optional `technicalDetail`)
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
- [x] Define fallback behavior when real response differs from contract
- [x] Track mismatch decisions in `api-discrepancies.md`

### 6) Complete integration docs
- [ ] Verify install/setup steps from clean machine perspective
- [ ] Keep config-merge examples for existing `preferences` + `mcpServers`
- [ ] Add troubleshooting matrix for common startup/JSON/env/path failures
- [ ] Add "first successful run" checklist with exact pass signals

### 7) Define acceptance criteria per phase
- [x] Add explicit Done criteria for M1 (evidence + sign-off artifacts)
- [x] Add explicit Done criteria for M2 (contract fidelity + tests + smoke)
- [x] Add explicit Done criteria for M3 (pilot pass rate + approval behaviors)
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
- `docs/phases/Phase-02-MCP-Server-and-Twelve-Tools.md`
- `docs/phases/Phase-03-Claude-Desktop-Integration-and-Pilot.md`
