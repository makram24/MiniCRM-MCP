# miniCRM Single-User MCP — Detailed implementation plan

This plan follows the **five phases** and **milestones M1–M5** in `Teszt-Projekt-MCP.md` (scope of work). Use it as a step-by-step checklist. **100% completion** means: every milestone acceptance condition is met, deliverables **0–6** are accepted, and **all quality metrics** in the scope document are satisfied (or explicitly waived in writing by the stakeholder).

**Related documents:** `Teszt-Projekt-MCP.md` (scope), `MiniCRM-Integrations-Manual.md` (API reference).

---

## 1. What “100% done” means (definition of done)

| Area | Must be true |
|------|----------------|
| **M1** | Client approved schema discovery document; all targeted endpoints + API key verified. |
| **M2** | Local MCP server runs; all **12 tools** implemented; **unit tests** per tool (success, bad params, empty results); **rate limiting** (60 req/min + burst handling). |
| **M3** | `claude_desktop_config.json` documented and working; **Claude Projects** system prompt in place; **10–15 pilot** Hungarian commands on live data; **≥ 90%** first-try success; **confirm-before-execute** and **plan-then-execute** observed in pilot. |
| **M4** | Edge cases exercised; **100%** clarification when ≥2 contact matches; **100%** confirm before every write tool; **≥ 95%** Hungarian replies; response times **&lt; 15 s** (simple) / **&lt; 30 s** (complex); bugs fixed; prompts updated as needed. |
| **M5** | Demo done; **source + config + install guide** delivered; **≥ 15** command examples, **≥ 5** troubleshooting cases; **handover minutes** signed. |
| **Security** | No delete tools; secrets only in **`.env`**, not in repo; data-handling notes in handover doc. |

---

## 2. Before Phase 1 — prerequisites (gather and verify)

Complete this checklist **before** counting “Phase 1 started.” Without these, you cannot reach 100%.

| # | Need | Owner | How to verify |
|---|------|--------|----------------|
| 1 | **miniCRM Professional** + **REST API add-on** | Client / org | API calls return data, not subscription errors (see manual: 404 can mean plan/auth issues). |
| 2 | **SystemId** (5 digits) + **REST API key** | Client | `curl` or Postman: Basic auth, `GET https://r3.minicrm.hu/Api/R3/Category` → 200 + JSON. |
| 3 | **Claude Pro or Team** (includes **Desktop** + **Projects**) | Client | Projects available; Desktop installs and runs. |
| 4 | **Claude Desktop** installed; MCP support OK | Client | Note Desktop version; compare with Anthropic MCP requirements; update if needed (scope risk #7). |
| 5 | **Node.js** LTS on dev machine (and later on client machine per guide) | You / client | `node -v`, `npm -v`. |
| 6 | **Time for feedback** after each phase | Client | Calendar slots agreed (scope assumption #6). |
| 7 | **Legal / access** to use production API key in your dev environment | Client | Written OK if policy requires it. |

**Optional but recommended:** miniCRM **test environment** (see Integrations Manual) for destructive-risk experiments — scope still expects final pilot on **live** data.

---

## 3. Phase 1 — Discovery and schema mapping (→ **M1**)

**Goal:** Know the *real* tenant (modules, statuses, fields, naming) and lock **I/O schemas** for all 12 tools before coding tools.

### Step-by-step

1. **Kick-off (30–60 min)**  
   Align on: Hungarian UX, no DELETE tools, single user, week timeline, decision gates M1 and M3.

2. **Map CRM structure (UI + admin)**  
   - List **products/modules** (CategoryIds) in use.  
   - Export or document **status names and IDs** per module (via UI + later Schema API).  
   - List **custom fields** on Contact / Project that matter for commands.  
   - Record **how the business names** things (e.g. “ügyfél”, “ajánlat”) for the future system prompt.

3. **Verify Claude Desktop version**  
   Document version; confirm MCP server can be registered (scope risk #7).

4. **API smoke tests with real credentials**  
   Using Integrations Manual patterns (Basic auth, UTF-8 JSON):  
   - `GET /Api/R3/Category`  
   - `GET /Api/R3/Schema/Project/{CategoryId}` for each relevant module  
   - `GET /Api/R3/Contact` with `Name`, `Email`, `Phone` query samples  
   - `GET /Api/R3/Project` with `CategoryId`, `StatusId`, pagination `Page`  
   - `GET /Api/R3/Project/{Id}` for one real card  
   - ToDo: confirm **create** method matches live API (manual shows POST heading but examples may use PUT — **verify** for `ToDo/`).  
   - `GET /Api/R3/ToDoList/{CardId}`  
   - `GET /Api/Invoice` with filters the scope implies (`ProjectId`, `ContactId` as applicable)  
   Save **raw JSON** samples (redact PII if sharing externally).

5. **Document discrepancies**  
   If responses differ from the manual, record field names, nesting, and edge cases (scope risk #1).

6. **Define MCP tool contracts**  
   For each of the 12 tools, produce a short spec:  
   - Input: parameter name, type, required/optional, validation rules.  
   - Output: shape passed back to Claude (prefer stable Hungarian-friendly labels per risk #4).  
   - Error mapping: HTTP codes → user-facing Hungarian messages.  
   - Which miniCRM endpoint(s) and query/body fields are used.

7. **Technical design note (1–3 pages)**  
   - Repo layout, MCP SDK usage, logging, config (`.env` keys).  
   - **Rate limit:** token bucket or sliding window for 60 req/min; queue or backoff on **429**.  
   - **Burst:** cap parallel API calls per tool chain.

8. **Node.js baseline**  
   - Init repo: `package.json`, TypeScript or JS per preference, linter, `.gitignore` including `.env`.  
   - Add dependency for **official MCP TypeScript SDK** (or equivalent per scope).  
   - Stub `src/index.ts` (or main entry) that starts a no-op MCP server — proves toolchain only (no full tools yet).

9. **Deliverable 0 — Schema discovery document**  
   Single document (or folder) containing: structure map, saved API samples, 12 tool I/O schemas, discrepancy list, technical note, link to repo stub.

10. **Gate M1**  
    - Walkthrough with stakeholder.  
    - **Sign-off** on documented structure and schemas (or recorded change requests).  
    - Do **not** start Phase 2 tool implementation until M1 is approved (per scope).

---

## 4. Phase 2 — MCP server and 12 tools (→ **M2**)

**Goal:** Production-quality local server: auth, logging, errors, rate limits, **12 tools**, **unit tests**.

### Step-by-step

1. **Configuration module**  
   - Read `MINICRM_SYSTEM_ID`, `MINICRM_API_KEY` (or names you choose) from **`.env`**.  
   - Never log full secrets.

2. **HTTP client for miniCRM**  
   - Base URL `https://r3.minicrm.hu` (or tenant-specific if ever different).  
   - Basic auth header from SystemId + API key.  
   - JSON `Content-Type`; UTF-8.  
   - Central place to map status codes (400, 404, 405, 429, 500) to structured errors for Claude.

3. **Rate limiter**  
   - Enforce **60 requests/minute** across all miniCRM calls from this process (Integrations Manual).  
   - On **429**, backoff and retry with jitter (respect manual / platform behaviour).  
   - Optional: **cache** `Category` and `Schema` responses briefly to save quota (scope risk #2).

4. **Implement tools (map 1:1 to scope)**

   | Tool | Implementation notes |
   |------|----------------------|
   | `kontakt_kereses` | `GET /Api/R3/Contact` with `Name`, `Email`, `Phone`, etc. per spec; handle `Count`/`Results`/pagination. |
   | `kontakt_lekeres` | `GET /Api/R3/Contact/{Id}`. |
   | `kontakt_letrehozas` | `PUT /Api/R3/Contact` with body per manual (`Type` Person/Business, etc.). |
   | `kontakt_modositas` | `PUT /Api/R3/Contact/{Id}` partial updates. |
   | `projekt_kereses` | `GET /Api/R3/Project` with `CategoryId`, `StatusId`, `ContactId`, `UserId`, `Name`, `Page`, dates if needed. |
   | `projekt_lekeres` | `GET /Api/R3/Project/{Id}`. |
   | `projekt_letrehozas` | `PUT /Api/R3/Project` create (omit Id); required fields depend on module/status — align with Phase 1 doc. |
   | `projekt_statusz_valtas` | `PUT /Api/R3/Project/{Id}` with **only** `StatusId` (and `Id`) per scope. |
   | `teendo_letrehozas` | `POST` or `PUT` to `/Api/R3/ToDo/` — **must match verified Phase 1 behaviour**. |
   | `teendo_lekeres` | `GET /Api/R3/ToDoList/{CardId}`; optional `Status` filter. |
   | `szamla_lekerdezes` | `GET /Api/Invoice` with query params per miniCRM Invoice chapter + Phase 1 samples. |
   | `schema_lekerdezes` | `GET /Api/R3/Category` + `GET /Api/R3/Schema/{Type}` where `Type` is `Business`, `Person`, or `Project/{CategoryId}` — expose in one tool or subcommands as designed in Phase 1. |

5. **No DELETE**  
   Do not expose purge/delete endpoints as tools (scope).

6. **MCP server wiring**  
   - Register all 12 tools with clear **Hungarian descriptions** in the tool metadata where the protocol allows (helps risk #4).  
   - Return structured text/JSON that the system prompt can instruct Claude to summarise in Hungarian.

7. **Logging and observability**  
   - Log tool name, correlation id, HTTP status, duration — **not** raw PII or secrets.

8. **Unit tests (required per scope)**  
   For **each** tool, automated tests with **mocks** for miniCRM:  
   - Happy path.  
   - Bad parameters (400-style behaviour).  
   - Empty `Results` / zero `Count`.  
   Plus one optional **integration** test suite (flag-guarded) hitting real API if the client allows.

9. **Local runbook**  
   - Command to start server, example `.env.example` without secrets.

10. **Gate M2**  
    - Manual checklist: invoke each tool via MCP inspector or test harness; compare to Phase 1 schemas.  
    - All unit tests green.  
    - Rate limiter demonstrably blocks excess calls in a test.

---

## 5. Phase 3 — Claude Desktop, system prompt, pilot (→ **M3**)

**Goal:** End-to-end NL Hungarian control with **confirm-before-execute**, **plan-then-execute**, and **persistent** context via **Projects**.

### Step-by-step

1. **`claude_desktop_config.json`**  
   - Point to your built server command (e.g. `node` + path to `dist/index.js`).  
   - Document **Windows/macOS** paths, env var loading, and working directory.  
   - **Deliverable 2:** paste final config into handover doc (redact nothing structural).

2. **Claude Project: system prompt (Deliverable 3)**  
   Include at minimum:  
   - CRM module **names** and **CategoryIds** as the client calls them.  
   - Status workflow rules (when to change status vs create task).  
   - **Mandatory:** before any **write** tool (`kontakt_letrehozas`, `kontakt_modositas`, `projekt_letrehozas`, `projekt_statusz_valtas`, `teendo_letrehozas`), Claude must **state the plan** and wait for **explicit user confirmation** (confirm-before-execute).  
   - **Mandatory:** for multi-step or bulk operations, Claude must **list steps** and wait for approval before executing (plan-then-execute).  
   - **Mandatory:** if contact search returns **≥ 2 plausible matches**, Claude must **ask the user to choose** (100% clarification target in Phase 4).  
   - **Language:** answer user in **Hungarian**; tool result summaries in Hungarian.  
   - **No deletes:** instruct never to attempt delete/purge via API.

3. **Pilot script (10–15 commands)**  
   Design commands that mirror **example use cases** in the scope (reports, tasks from invoices, status bulk change with approval, ambiguous name, schema question, etc.).  
   Record: command text, tools called, pass/fail, time to complete.

4. **Functional test log**  
   For each of the 12 tools, at least one **successful** and one **failure-path** observation from real or pilot sessions (scope: document success/failure cases).

5. **Prompt tuning**  
   Fix gaps found in pilot (English leakage, wrong tool choice, missing confirmation).

6. **Gate M3 (decision point)**  
   - Count pilot successes: **≥ 90%** on first try.  
   - Confirm both **approval layers** appeared when required.  
   - If below bar: iterate prompt or fix server **before** declaring M3 complete.  
   - Record any **scope change** decisions.

---

## 6. Phase 4 — Validation and tuning (→ **M4**)

**Goal:** Prove **quality metrics** and harden edge cases.

### Step-by-step

1. **Per-tool success rate**  
   Aggregate logs from pilot + validation; ensure each tool meets agreed behaviour.

2. **Edge-case matrix (execute and record)**  

   | Case | Expected |
   |------|----------|
   | ≥2 contacts same name | Claude **asks** which one; no silent pick (100%). |
   | Empty search results | Clear Hungarian message; no hallucinated IDs. |
   | Invalid enum / StatusId | Propagate API error in understandable Hungarian. |
   | Rate limit | Server queues/backs off; user sees polite wait/retry message. |
   | Ambiguous project match | Clarification or narrow search — define in prompt. |

3. **Approval audit**  
   For **each write tool**, run at least one test where user **must** confirm; verify **100%** compliance.

4. **Hungarian quality sample**  
   Collect ~20 replies; score **≥ 95%** Hungarian (scope); fix prompt/tool labels if not.

5. **Performance**  
   Time **simple** read-only flows (&lt; 15 s) and **complex** multi-tool flows (&lt; 30 s) — manual stopwatch is fine per scope.

6. **Bugfix + prompt freeze candidate**  
   Fix issues; tag a release commit for handover.

7. **Gate M4**  
   Checklist against **Quality target metrics** table in scope; stakeholder sign-off on “ready for handover.”

---

## 7. Phase 5 — Handover (→ **M5**)

**Goal:** Client can **reinstall alone**; all deliverables accepted.

### Step-by-step

1. **README** in repo: purpose, requirements, `npm install`, `npm run build`, run command, env vars, testing.

2. **Installation guide (Deliverable 4)**  
   - Install Node.js (link LTS).  
   - Clone/copy files.  
   - `cp .env.example .env` and fill SystemId + API key.  
   - Build/start server.  
   - Place `claude_desktop_config.json` snippet in correct OS path for Claude Desktop.  
   - Restart Claude Desktop; verify 12 tools appear.

3. **Command examples + troubleshooting (Deliverable 5)**  
   - **≥ 15** real Hungarian command examples tailored to **this** CRM.  
   - **≥ 5** troubleshooting entries (auth fail, 429, wrong StatusId, empty result, Desktop not loading MCP).

4. **Data handling appendix**  
   - Rotate API key if exposed; `.env` permissions; no commits of secrets.

5. **Demo session**  
   Live walkthrough on client data; same scenarios as pilot highlights.

6. **Handover minutes (Deliverable 6)**  
   List delivered artefacts, version/revision, signatures.

7. **Gate M5**  
   Client confirms successful install **using only the guide** (or note assistance given and update guide).

---

## 8. Weekly rhythm (aligned with “one week” scope)

| Day focus | Phases |
|-----------|--------|
| Days 1–2 | Phase 1 + start Phase 2 baseline |
| Days 2–4 | Phase 2 complete → M2 |
| Days 4–5 | Phase 3 → M3 |
| Day 5–6 | Phase 4 → M4 |
| Day 7 | Phase 5 → M5 |

Adjust if M1 or M3 gates require extra iteration — **quality gates override the calendar**.

---

## 9. Artefacts to keep in version control (suggested)

- Source code + tests + `README` + `.env.example`  
- `docs/schema-discovery/` (or single PDF/Markdown export of Deliverable 0)  
- `docs/prompts/system-prompt.md` (canonical text for Claude Project)  
- `docs/claude_desktop_config.example.json`  
- `docs/pilot-log.md`, `docs/validation-log.md`  
- `docs/command-examples.md`, `docs/troubleshooting.md`

---

## 10. Quick “am I at 100%?” checklist

- [ ] M1, M2, M3, M4, M5 acceptance conditions satisfied  
- [ ] Deliverables 0–6 complete and accepted  
- [ ] ≥ 90% pilot + validation command success (first try)  
- [ ] 100% clarification when ≥2 contacts match (tested)  
- [ ] 100% confirm-before-execute on all writes (tested)  
- [ ] ≥ 95% Hungarian responses (sampled)  
- [ ] Response time targets met (sampled)  
- [ ] ≥ 15 commands, ≥ 5 troubleshooting cases, install guide tested by client  
- [ ] No secrets in git; no delete tools shipped  

When every box is checked, the task matches **100% completion** as defined by the scope document.
