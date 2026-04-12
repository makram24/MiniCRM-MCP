# One-week deadline — parallel work plan (Track A + Track B)

This document turns the **two-track** approach from the project check-in plan into a **detailed, actionable** backlog. Use it when **miniCRM.hu or the client may be slow to reply** (e.g. weekend/holiday) so you still move forward without pretending Phase 1 discovery is finished.

**Formal scope reminder:** `docs/Teszt-Projekt-MCP.md` and `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md` define **Phase 1** as discovery + Deliverable 0 + **M1 sign-off**; **Phase 2** as full MCP implementation. **Track B** below is mostly **Phase 1 documentation / prep** and **optional Phase 2–3 preparation** that does **not** replace real API samples or M1. When the REST key works, **Track A takes priority** until M1-critical items are done.

**Related files in this folder**

| File | Role |
|------|------|
| `PHASE-1-REMAINING.md` | What Phase 1 still owes (aligned with Phase-01 runbook) |
| `M1-PRODUCT-OWNER-SIGNOFF.md` | What to show the product owner at M1 |
| `README.md` | Deliverable 0 file list |

**Related phases (paths under `docs/phases/`)**

| Phase | Runbook | What it covers (for references below) |
|-------|---------|--------------------------------------|
| **Phase 1** | `Phase-01-Discovery-and-Schema-Mapping.md` | UI map, API smoke, samples, contracts, technical design, stub (Step 9); **M1 gate** (Steps 11–12) |
| **Phase 2** | `Phase-02-MCP-Server-and-Twelve-Tools.md` | Server hardening, tests, real tool behaviour vs contracts |
| **Phase 3** | `Phase-03-Claude-Desktop-Integration-and-Pilot.md` | Desktop config, system prompt, pilot scenarios |

**Code / ops**

| Resource | Role |
|----------|------|
| `minicrm-mcp-server/README.md` | Build, run, mock vs live |
| `minicrm-mcp-server/MOCK-AND-LIVE-REST.md` | Before / switch / after REST |
| `minicrm-mcp-server/scripts/smoke-api.mjs` | **Track A:** live smoke + `SMOKE_SAVE=1` |

---

## How to use this plan

1. **Each working day:** pick **≥1 Track B** item if Track A is blocked, and **≥1 Track A** item when the API or client is available.  
2. **When REST returns 200:** temporarily **favour Track A** until `api-samples/`, ToDo-create verification, and `mcp-tool-contracts.md` updates are caught up (**Phase 1 Step 4–6**).  
3. **Tick** `[ ]` boxes as you complete work (this file is your living checklist).  
4. **End of day (2 minutes):** note tomorrow’s single top priority for Track A and one Track B fallback.

---

## Track A — needs REST API and/or client

*Grounded in **Phase 1** (`Phase-01` Steps 2, 3, 4, 5, 6, 10, 11) and **M1** (`M1-PRODUCT-OWNER-SIGNOFF.md`).*

### A1 — Access and proof (Phase-01 §2 prerequisites, Step 3)

- [ ] Confirm **Professional + REST API add-on** (client / billing) — **P1.1** in Phase-01.  
- [ ] **SystemId** + **REST API key** (not other product keys) — **P1.2–P1.3**.  
- [ ] Baseline: `GET https://r3.minicrm.hu/Api/R3/Category` → **200** + JSON (**Phase-01 Step 3.2**).  
- [ ] Run `minicrm-mcp-server`: `npm run smoke:api` with `.env` live mode; fix env until all steps **2xx** (`docs/deliverable-0/api-samples/README.md` for 401 hints).

### A2 — Save real samples (Phase-01 Step 4)

For each row: store URL, method, status, body under `docs/deliverable-0/api-samples/` and add a line to `api-test-log.md` (from `api-test-log-TEMPLATE.md`).

- [ ] **4.1** Category — `GET /Api/R3/Category`  
- [ ] **4.2** Schema — `GET /Api/R3/Schema/Project/{CategoryId}` (+ Business/Person if needed)  
- [ ] **4.3** Contact search — Name / Email / Phone (as manual allows)  
- [ ] **4.4** Contact detail — `GET /Api/R3/Contact/{Id}` (Person and/or Business)  
- [ ] **4.5** Project search + pagination — `Page`, 100/page, index from 0  
- [ ] **4.6** Project detail — `GET /Api/R3/Project/{Id}`  
- [ ] **4.7** ToDo list — `GET /Api/R3/ToDoList/{CardId}`  
- [ ] **4.8** **ToDo create** — record **actual** working method (POST vs PUT) and body (**Phase-01 Step 4.8** — blocks honest Phase 2)  
- [ ] **4.9** Invoice — align with Integrations Manual + scope; save one list response  
- [ ] **4.10** Optional: history / `UpdatedSince` / other filters if pilot needs them  

Optional automation: **`SMOKE_SAVE=1`** on smoke script to populate part of `api-samples/` (extend script if a Step 4 call is missing).

### A3 — Gap analysis (Phase-01 Step 5)

- [ ] Fill `api-discrepancies.md` (from template): tenant vs `docs/MiniCRM-Integrations-Manual.md`.

### A4 — Tool contracts from reality (Phase-01 Step 6)

- [ ] Update `mcp-tool-contracts.md`: for **all 12 tools**, replace TBD **Inputs / Outputs / Errors / pagination** using real JSON (**Phase-01 Step 11** requires no fake completeness).

### A5 — Client-specific discovery (Phase-01 Steps 1–2)

- [ ] Kick-off / follow-up notes if not done (**Step 1**).  
- [ ] `crm-structure-map.md`: modules, CategoryIds, status **names**, custom field registered names, HU glossary (**Step 2**) — needs **UI access** with client/admin.

### A6 — M1 package completion (Phase-01 Steps 10–11, `M1-PRODUCT-OWNER-SIGNOFF.md`)

- [ ] Executive summary (1 page).  
- [ ] `technical-design-phase1.md` — consistent with real rate-limit / error behaviour if tested.  
- [ ] `environment-notes.md` — Node, client used, date; Claude Desktop version when known (**Phase-01 Step 7**).  
- [ ] Internal QA checklist (**Phase-01 Step 11**) — all boxes true before PO meeting.  
- [ ] Schedule **M1 meeting** and collect **sign-off evidence** (**Phase-01 Step 12**).

---

## Track B — no miniCRM reply (offline or unblocked by you alone)

*Mostly **Phase 1** artefact prep and doc work; some items **preview Phase 2–3** without replacing live verification.*

### B1 — Phase 1 documents you can draft without API

- [x] Copy `crm-structure-map-TEMPLATE.md` → working `crm-structure-map.md` with **structure only**: tables, empty rows, “*to fill after UI session*”.  
- [x] Copy `api-test-log-TEMPLATE.md` → `api-test-log.md` with **column headers** and example rows marked *template*.  
- [x] Copy `api-discrepancies-TEMPLATE.md` → `api-discrepancies.md` with intro + “*to fill after samples*”.  
- [x] `mcp-tool-contracts.md`: add **Hungarian user-facing descriptions** per tool where missing; keep **Outputs** as TBD until samples exist (**Phase-01 Step 6**).  
- [x] Draft **`technical-design-phase1.md`** from repo reality: stdio MCP, `MINICRM_USE_MOCK`, sliding **60/min** limiter, `.env` names, no secrets on stdout (**Phase-01 Step 8** + **Phase 2** scope alignment).  
- [x] Draft **`environment-notes.md`** (Node `node -v`, npm, OS date); leave Desktop version blank or “TBD before Phase 3” (**Phase-01 Step 7**).

### B2 — Development against fixtures (Phase 2–style, mock-safe)

Per **Phase 2** runbook themes (tests, ergonomics) — **mock only**, no claim of M1 completion.

- [ ] `MINICRM_USE_MOCK=true`: exercise **all 12 tools** end-to-end from Claude Desktop or MCP client; note bugs in tool descriptions or param names (`minicrm-mcp-server/src/register-crm-tools.ts`).  
- [x] Align `fixtures/*.json` with **Integrations Manual** examples if any handler path mismatches — *baseline fixtures already aligned; revisit after live samples*.  
- [x] Unit tests for query-string builders / `projekt_statusz_valtas` body shape — `npm test` (`search-params`, `ids`, `project-status`).  
- [x] Review **Phase-02** checklist — see `docs/deliverable-0/PHASE-02-PREP-TRACK-B.md`.

### B3 — Phase 3 preparation (optional, does not unblock M1)

From **`Phase-03-Claude-Desktop-Integration-and-Pilot.md`**:

- [ ] Draft **`claude_desktop_config.json`** snippet pointing at `npm run start` / `node dist/index.js` (paths for **your** machine).  
- [ ] Outline **system prompt** sections: CRM modules, approval before writes, ambiguous contact handling — fill placeholders until `crm-structure-map.md` is real.  
- [ ] List **pilot scenarios** from scope (`Teszt-Projekt-MCP.md` use-case table) as a checkbox list for later.

### B4 — Communication buffer (protects the week)

- [ ] Pre-write **follow-up** to miniCRM/client: REST access, blocker = M1 samples + sign-off deadline.  
- [ ] If mid-week still no key: second channel (call, alternate contact); ask for **test environment** or **admin slot** for UI mapping (**Phase-01 Step 2**).

---

## Suggested week shape (adjust to your real calendar)

| When | Emphasis |
|------|----------|
| **Weekend / no reply** | Track B1 + B2 + B4; light scope to rest. |
| **First business day API works** | Track A2 → A4 immediately; then A3. |
| **Mid-week** | Finish A5–A6 if samples exist; else escalate B4. |
| **End of week** | PO review using `M1-PRODUCT-OWNER-SIGNOFF.md`; buffer for contract edits. |

---

## Explicit non-goals (avoid scope drift)

- Do **not** mark Phase 1 **complete** or contracts **final** using only fixtures — **Phase-01 Step 4** requires **real** responses.  
- Do **not** skip **ToDo create verification (A2 / 4.8)** — **Phase-01 Step 11** and **Phase-02** both depend on it.  
- Formal **Phase 2 complete** and **Phase 3 pilot** remain defined by their runbooks; this file only **sequences** work around API availability.

---

*Derived from the parallel “Track A / Track B” schedule plan; aligned with `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`, `PHASE-1-REMAINING.md`, and `M1-PRODUCT-OWNER-SIGNOFF.md`.*
