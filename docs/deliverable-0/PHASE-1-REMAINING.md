# Phase 1 — what is left

**Runbook:** `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`  
**Scope:** `docs/Teszt-Projekt-MCP.md` → Phase 1

This file is a living checklist. Tick items as they are completed.

---

## 1. Hard prerequisites (until these pass, discovery is incomplete)

| ID | Item | Status / notes |
|----|------|----------------|
| P1.1 | miniCRM **Professional** + **REST API add-on** | |
| P1.2 | **SystemId** (Basic auth username) | |
| P1.3 | **REST API key** (Basic auth password — not Chamaileon or other keys) | |
| P1.4 | Permission to use credentials in dev | |
| P1.5 | UI access to map modules, statuses, field **registered names** | |
| P1.6–P1.8 | Node, Git, stakeholder time | |

**Connectivity:** `GET https://r3.minicrm.hu/Api/R3/Category` with Basic auth must return **200** and JSON (not **401**).

---

## 2. API discovery (Step 4 — save real responses)

For each call: store URL, method, HTTP status, response body under `docs/deliverable-0/api-samples/`, and one line in `api-test-log.md` (from template).

| Step | Endpoint / focus | Done? |
|------|------------------|-------|
| 4.1 | `GET /Api/R3/Category` | |
| 4.2 | `GET /Api/R3/Schema/Project/{CategoryId}` (+ optional Business / Person) | |
| 4.3 | Contact search (`Name`, `Email`, `Phone`, …) | |
| 4.4 | `GET /Api/R3/Contact/{Id}` (Person + Business if applicable) | |
| 4.5 | `GET /Api/R3/Project?…` + pagination (`Page`, 100/page, index from 0) | |
| 4.6 | `GET /Api/R3/Project/{Id}` | |
| 4.7 | `GET /Api/R3/ToDoList/{CardId}` | |
| 4.8 | **ToDo create — verify HTTP method** (POST vs PUT) on tenant; save request/response | |
| 4.9 | Invoice read (paths/filters per Integrations Manual + scope) | |
| 4.10 | Optional: history / `UpdatedSince` / other filters | |

**Automation:** `minicrm-mcp-server` → `npm run smoke:api` (with `SMOKE_SAVE=1` when auth works) helps cover part of this; extend or document gaps.

---

## 3. Documentation artefacts (Deliverable 0)

| Artefact | Purpose | Done? |
|----------|---------|-------|
| Executive summary (~1 page) | What was learned, risks, open points | |
| `crm-structure-map.md` | UI modules, CategoryIds, status names, custom fields, glossary HU | |
| `api-samples/` + `api-test-log.md` | Raw JSON library + test log | |
| `api-discrepancies.md` | Tenant vs manual differences | |
| `mcp-tool-contracts.md` | All **12** tools: Inputs, Outputs, Errors, pagination — **no TBD** where samples exist | |
| `technical-design-phase1.md` | Layout, `.env`, logging, rate limit, 429, tests preview | |
| `environment-notes.md` | Node, curl/client, **Claude Desktop version** if available | |

Templates live in the same folder (`*-TEMPLATE.md`); copy/rename or merge into final names as agreed.

---

## 4. Runbook steps easy to overlook

| Step | Item | Done? |
|------|------|-------|
| 1 | Kick-off meeting notes | |
| 5 | Gap analysis vs `MiniCRM-Integrations-Manual.md` | |
| 7 | Claude Desktop version (or “open until Phase 3”) | |
| 11 | Internal QA checklist before M1 (see Phase-01 doc §6 Step 11) | |
| 12 | **Gate M1** — client sign-off on Deliverable 0 | |

---

## 5. Relation to the current codebase

- The **Node + MCP + 12 tools** work in `minicrm-mcp-server` goes **beyond** the Phase 1 runbook’s “stub only” (Step 9). It is useful for **mock** work and early integration, but it **does not replace** real samples, filled contracts, or M1.
- After REST works: run smoke → save samples → update `mcp-tool-contracts.md` → align any handler details (e.g. ToDo method, invoice path) with **verified** behaviour.

---

## 6. Can we continue with the next phases?

**Formally (scope + Phase 1 runbook):** Phase 2 should start after **M1 is approved** — Deliverable 0 complete enough that the client signs off, and critical endpoints (including **ToDo create**) verified or explicitly documented as blockers.

**Practically:** You can **prepare** later phases in parallel (e.g. refine mock server, draft system prompt, plan Claude Desktop config) as long as everyone agrees that **contracts and live API behaviour can still change** until M1 is closed. Anything that **freezes** schemas or promises behaviour should wait for real API evidence or a written exception in Deliverable 0.

**Summary:** Yes, you can **continue preparatory work** for Phases 2–3; the **official** handoff to Phase 2 per the written process is **M1 sign-off** + complete tool contracts based on **real** (or explicitly documented) API results.

---

*Last aligned with Phase-01 runbook structure; update this file as items close.*
