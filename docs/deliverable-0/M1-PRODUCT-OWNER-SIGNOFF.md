# M1 sign-off — what to show the product owner

**Milestone:** M1 — schema mapping complete (`docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`, Step 12).  
**Goal:** The product owner **approves Deliverable 0** so tool contracts and discovery can be **frozen** as the Phase 2 baseline.

Complete your **internal** checklist (Phase-01 Step 11) *before* this meeting. Use `PHASE-1-REMAINING.md` to confirm nothing critical is missing.

---

## 1. What sign-off means (say this in one sentence)

“We have mapped **your** miniCRM (modules, statuses, fields), **proved** the REST API with real responses, and written **12 tool contracts** the MCP server will implement next. You confirm this documentation is **accurate enough** to build on.”

---

## 2. Suggested meeting flow (~45–60 min)

| # | Topic | What you show |
|---|--------|----------------|
| 1 | Context | Scope reminder: 12 tools, **no delete**, Hungarian UX, single-user MCP; Phase 2 builds the server against **these** contracts. |
| 2 | CRM in their language | **`crm-structure-map.md`** — modules (CategoryId), status names, important custom fields, **glossary** (UI label ↔ how users say it). Optionally: quick **live miniCRM UI** tour to match the doc. |
| 3 | API is real | **`api-test-log.md`** + **`api-samples/`** — at least **one successful JSON sample** per area: **Contact**, **Project**, **ToDo**, **Invoice**, **Schema/Category**. Redact PII if policy requires; keep structure visible. |
| 4 | How Claude will call CRM | **`mcp-tool-contracts.md`** — walk **one** tool **end-to-end** (runbook suggests e.g. **`projekt_statusz_valtas`**: endpoint, inputs, outputs, errors). Then skim that **all 12 tool names** appear with filled sections (no empty “TBD” on critical fields). |
| 5 | Honest gaps | **`api-discrepancies.md`** — where the tenant or behaviour differs from `MiniCRM-Integrations-Manual.md`, and **how Phase 2 will handle** each item (e.g. ToDo create method verified, pagination quirks). |
| 6 | Engineering baseline | **`technical-design-phase1.md`** — short: config (`.env` names only), **60 req/min** handling, logging / no secrets, repo layout. |
| 7 | Environment | **`environment-notes.md`** — Node version, how API was tested; Claude Desktop version if known (or note as open before Phase 3). |
| 8 | Code pointer (optional) | **Git commit / tag** or branch name for `minicrm-mcp-server/` — explain that implementation may already include mock/live tools, but **contracts** are what M1 freezes. |

---

## 3. Checklist — artefacts the PO should see (or receive as a pack)

Tick when ready to share (print, PDF bundle, or shared folder).

- [x] **Executive summary** (1 page): what you learned, main risks, open points — `EXECUTIVE-SUMMARY-M1.md`  
- [x] **`crm-structure-map.md`** (pilot snapshot — replace ids if client tenant differs)  
- [x] **`api-samples/`** + **`api-test-log.md`**  
- [x] **`api-discrepancies.md`**  
- [x] **`mcp-tool-contracts.md`** (all **12** tools — **v1.0-live**)  
- [ ] **`technical-design-phase1.md`** (confirm PO reviewed engineering draft)  
- [ ] **`environment-notes.md`** (confirm Node / Desktop versions filled for your org)  
- [x] **ToDo create**: documented **working HTTP method** (**PUT**; POST → **405**) for pilot tenant  
- [x] **Evidence** that critical endpoints have **2xx samples** — smoke + `api-samples/`  

**Approver:** complete §5 in this file + `PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md` when the PO meeting finishes.

---

## 4. What you ask the product owner to approve

Use or adapt this wording for the meeting close or a follow-up email:

1. The **CRM structure map** reflects how the organisation uses miniCRM (modules, statuses, key fields, naming).  
2. The **API samples** are acceptable as representative (with any agreed redaction).  
3. The **12 MCP tool contracts** are the right functional split for Phase 2 (including **no delete** tools).  
4. **Discrepancies** between the manual and live API are understood and the mitigation plan is acceptable.  
5. The team may **freeze** `mcp-tool-contracts.md` as the baseline for implementation, with changes only via agreed change control.

**If something is wrong:** capture it as **change requests**, update Deliverable 0, and **reschedule** sign-off (per Phase-01 Step 12).

---

## 5. Evidence of sign-off (for the project file)

Keep **one** of:

- Email from the product owner confirming the above, or  
- Signed PDF of Deliverable 0 / acceptance section, or  
- Ticket or meeting minutes with **Approver**, **Date**, and **Outcome** (approved / approved with actions / not approved).

---

## 6. References

- Runbook: `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md` (Steps 11–12, §7 outputs)  
- Scope decision point: `docs/Teszt-Projekt-MCP.md` — Phase 1 end  
- Open work checklist: `docs/deliverable-0/PHASE-1-REMAINING.md`
