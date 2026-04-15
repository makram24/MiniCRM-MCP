# Phase 1 — what is left

**Runbook:** `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`  
**Scope:** `docs/Teszt-Projekt-MCP.md` → Phase 1

**Status (2026-04-13):** Engineering deliverables are **complete in repo**. Remaining items are **stakeholder sign-off** and **tenant-specific** tweaks if the client’s miniCRM differs from the pilot snapshot.

---

## 1. Hard prerequisites (until these pass, discovery is incomplete)

| ID | Item | Status / notes |
|----|------|----------------|
| P1.1 | miniCRM **Professional** + **REST API add-on** | Done for pilot tenant |
| P1.2 | **SystemId** (Basic auth username) | Done |
| P1.3 | **REST API key** (Basic auth password — not Chamaileon or other keys) | Done — rotate if exposed |
| P1.4 | Permission to use credentials in dev | Org decision |
| P1.5 | UI access to map modules, statuses, field **registered names** | Done for pilot; **refresh** `crm-structure-map.md` if admin changes fields |
| P1.6–P1.8 | Node, Git, stakeholder time | Done |

**Connectivity:** `GET https://r3.minicrm.hu/Api/R3/Category` with Basic auth returns **200** when key + SystemId are valid.

---

## 2. API discovery (Step 4 — save real responses)

| Step | Endpoint / focus | Done? |
|------|------------------|-------|
| 4.1 | `GET /Api/R3/Category` | [x] |
| 4.2 | `GET /Api/R3/Schema/Project/{CategoryId}` (+ optional Business / Person) | [x] |
| 4.3 | Contact search (`Name`, `Email`, `Phone`, …) | [x] |
| 4.4 | `GET /Api/R3/Contact/{Id}` | [x] |
| 4.5 | `GET /Api/R3/Project?…` + pagination (`Page`, 0-based) | [x] |
| 4.6 | `GET /Api/R3/Project/{Id}` | [x] |
| 4.7 | `GET /Api/R3/ToDoList/{CardId}` | [x] |
| 4.8 | **ToDo create — verify HTTP method** (POST vs PUT) | [x] **PUT** live; POST 405 |
| 4.9 | Invoice read | [x] `GET /Api/Invoice/List` |
| 4.10 | Optional: history / `UpdatedSince` / other filters | [ ] Optional |

**Automation:** `minicrm-mcp-server` → `npm run smoke:api` (+ `SMOKE_SAVE=1`, `SMOKE_PROBE_TODO=1` as needed).

---

## 3. Documentation artefacts (Deliverable 0)

| Artefact | Purpose | Done? |
|----------|---------|-------|
| Executive summary (~1 page) | What was learned, risks, open points | [x] `EXECUTIVE-SUMMARY-M1.md` |
| `crm-structure-map.md` | UI modules, CategoryIds, status names, custom fields, glossary HU | [x] pilot snapshot |
| `api-samples/` + `api-test-log.md` | Raw JSON library + test log | [x] |
| `api-discrepancies.md` | Tenant vs manual differences | [x] |
| `mcp-tool-contracts.md` | All **12** tools: Inputs, Outputs, Errors | [x] **v1.0-live** |
| `technical-design-phase1.md` | Layout, `.env`, logging, rate limit, 429, tests preview | [x] draft — PO review |
| `environment-notes.md` | Node, curl, **Claude Desktop version** | [ ] fill versions per org |

---

## 4. Runbook steps easy to overlook

| Step | Item | Done? |
|------|------|-------|
| 1 | Kick-off meeting notes | Org |
| 5 | Gap analysis vs `MiniCRM-Integrations-Manual.md` | [x] `api-discrepancies.md` |
| 7 | Claude Desktop version | [ ] add to `environment-notes.md` |
| 11 | Internal QA checklist before M1 | [x] `INTERNAL-QA-CHECKLIST.md` |
| 12 | **Gate M1** — client sign-off on Deliverable 0 | [ ] `PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md` |

---

## 5. Relation to the current codebase

The **Node + MCP + 12 tools** implementation in `minicrm-mcp-server` matches **v1.0-live** contracts. Further changes require **change control** (update `mcp-tool-contracts.md` version + `api-discrepancies.md` if API drift).

---

## 6. Can we continue with the next phases?

**Formally:** M1 PO sign-off is still the official close if you follow the written process strictly.

**Practically:** M2 implementation and M3 prep are **done in repo**; run pilot + collect sign-off evidence to close gates formally.

---

*Last updated: 2026-04-13 — aligned with `PHASE-BY-PHASE-CHECKLIST.md`.*
