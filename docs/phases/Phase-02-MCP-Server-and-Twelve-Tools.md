# Phase 2 — MCP server development and implementation of 12 tools

**Milestone:** M2 — 12 tools implemented  
**Scope reference:** `Teszt-Projekt-MCP.md` → “Phase 2: MCP server development and implementation of 12 tools”  
**Companion overview:** `Teszt-Projekt-MCP-Implementation-Plan.md`  
**API reference:** `MiniCRM-Integrations-Manual.md`

Standalone runbook for **Phase 2 only**. Implement the **local Node.js MCP server** with all **12 CRM tools**, **unit tests**, and **rate limiting**.

---

## 1. Purpose of Phase 2

- Build **production-quality** MCP server code: config, HTTP client, logging, structured errors.  
- Implement **exactly the 12 tools** defined in Phase 1 **tool contracts** (no extras, no delete tools).  
- Enforce **60 requests/minute** to `https://r3.minicrm.hu/Api/R3/...` paths per Integrations Manual; handle **429**.  
- Add **unit tests** for every tool: success, bad parameters, empty results.  
- Prove **local** operation with the client API key in dev (integration smoke optional).  
- Achieve **gate M2**: every tool returns correct results on test data / mocks.

---

## 2. Before you start Phase 2 (hard prerequisites)

**Do not start Phase 2** until all items are satisfied.

| # | Prerequisite | Source | Verify |
|---|----------------|--------|--------|
| P2.1 | **M1 signed off** | Phase 1 gate | Written approval or ticket “M1 complete” |
| P2.2 | **Frozen tool contracts** for all 12 tools | Deliverable 0 / `mcp-tool-contracts.md` | Document version number or git tag |
| P2.3 | **Verified ToDo create** HTTP method and body | Phase 1 Step 4.8 | Note in contracts, not “TBD” |
| P2.4 | **SystemId + API key** available for dev | Client | Stored in local `.env` only |
| P2.5 | **Phase 1 repo stub** checked in | Git | Branch agreed (`main` / `develop`) |
| P2.6 | **Node.js LTS** + package manager | Your machine | Same major version as Phase 1 stub |

**Optional**

| # | Item |
|---|------|
| O1 | CI pipeline (GitHub Actions, etc.) for `npm test` |
| O2 | Separate **integration test** flag — runs only when `MINICRM_INTEGRATION=1` |

---

## 3. Dependencies on previous work

| Depends on | What you need from it |
|------------|------------------------|
| **Phase 1** | Tool contracts, API samples, discrepancy notes, technical design, repo stub |
| **Phase 1** | CategoryId / StatusId / field names for validation rules |
| **Not required yet** | Claude Desktop full wiring (Phase 3), system prompt text (Phase 3) |

If Phase 1 left **open discrepancies**, resolve or implement **defensive parsing** and document behaviour in README.

---

## 4. Roles

| Role | Tasks |
|------|--------|
| Developer | Implementation + tests |
| Client | Answer clarifications on required fields / business rules |
| Security | Approve logging and `.env` handling if enterprise policy applies |

---

## 5. Materials and access

- [ ] `.env` on dev machine (never commit): `MINICRM_SYSTEM_ID`, `MINICRM_API_KEY` (or names from Phase 1 design)  
- [ ] Optional: `MINICRM_BASE_URL` if design allows non-default host (default `https://r3.minicrm.hu`)  
- [ ] Copy of **mcp-tool-contracts.md** in repo under `docs/` for traceability  
- [ ] MCP SDK documentation (Anthropic) for current **stdio** server pattern  

---

## 6. Step-by-step implementation

### Step 1 — Repository hygiene

**Before writing features:**

1.1 Ensure `.gitignore` includes `.env`, `*.log`, `node_modules/`, build output.  
1.2 Add **`.env.example`** with **empty** placeholder values and comments for each variable.  
1.3 Add **README** section “Phase 2 setup”: clone, `cp .env.example .env`, fill vars, `npm install`, `npm test`, `npm run start` (or equivalent).

---

### Step 2 — Configuration module

**2.1** Load env at startup (e.g. `dotenv`).  
**2.2** Validate presence of SystemId and API key; **fail fast** with clear message if missing.  
**2.3** Export a typed config object for the rest of the app.  
**2.4** **Never** log full key; truncate in debug logs (e.g. last 4 chars only if ever needed).

---

### Step 3 — HTTP client for miniCRM

**3.1 Base URL**  
Default `https://r3.minicrm.hu` unless Phase 1 design says otherwise.

**3.2 Authentication**  
HTTP **Basic**: username = SystemId, password = API key (Integrations Manual / Postman instructions).

**3.3 Headers**  
- `Accept: application/json`  
- `Content-Type: application/json` for bodies  
- UTF-8 encoding end-to-end  

**3.4 Request wrapper**  
Single internal function, e.g. `minicrmRequest({ method, path, query, body })`, that:

- Runs **through the rate limiter** (Step 4)  
- Parses JSON on success  
- On non-OK: reads body text; maps to a **structured error** object `{ code, httpStatus, messageHu, technicalDetail? }`  
- On **429**: applies backoff policy (Step 4)

**3.5 Path conventions**  
- R3 API: `/Api/R3/...`  
- Invoice API: `/Api/Invoice...` per manual (note: manual states different rate limit for Invoice endpoint — design limiter scope accordingly; at minimum, **count Invoice calls** toward safe global throttling if unsure).

---

### Step 4 — Rate limiting and burst control

**4.1 Requirement**  
Integrations Manual: **60 requests per minute** for standard R3 URLs (`https://r3.minicrm.hu/Api/R3`).

**4.2 Implementation options**  
- Token bucket: 60 tokens/min refill  
- Sliding window counter  

**4.3 Queue vs reject**  
Prefer **queue** with timeout so Claude does not see random failures; if wait exceeds threshold, return Hungarian error “Túl sok kérés, próbálja újra néhány másodperc múlva.”

**4.4 429 handling**  
Retry with **exponential backoff + jitter**; cap retries; document max wait.

**4.5 Burst**  
Limit **concurrent** in-flight requests (e.g. max 3–5) to avoid stampedes when multiple tools chain.

**4.6 Tests**  
Unit test: mock clock or inject limiter config to assert throttling triggers.

---

### Step 5 — Logging and observability

**5.1** Structured logs: ISO timestamp, level, **tool name**, correlation id (optional uuid per MCP request).  
**5.2** Log HTTP status and **duration**; do not log full response bodies in production log level if they contain PII.  
**5.3** Debug mode (env flag) may log truncated bodies — default off.

---

### Step 6 — MCP server shell

**6.1** Use **stdio** transport (standard for Claude Desktop local MCP).  
**6.2** Register server metadata (name, version).  
**6.3** Implement **list_tools** returning all 12 tools with:  
- `name` exactly as contract  
- `description` in **Hungarian** (helps model stay in Hungarian per scope risk #4)  
- `inputSchema` JSON Schema matching contract inputs  

**6.4** Implement **call_tool**:  
- Validate input against schema  
- Dispatch to handler  
- Return **text** or **structured content** as MCP expects; prefer consistent format (e.g. JSON string with Hungarian keys)

---

### Step 7 — Implement each tool handler

Implement in **dependency order** (suggested):

1. `schema_lekerdezes` — used to debug enums; may call Category + Schema endpoints.  
2. `kontakt_kereses`, `kontakt_lekeres`  
3. `kontakt_letrehozas`, `kontakt_modositas`  
4. `projekt_kereses`, `projekt_lekeres`  
5. `projekt_letrehozas`, `projekt_statusz_valtas`  
6. `teendo_lekeres`, `teendo_letrehozas`  
7. `szamla_lekerdezes`

**Per tool, do:**

**7.a** Map to exact HTTP method/path from **Phase 1 contract**.  
**7.b** Map tool arguments → query string or JSON body per Integrations Manual.  
**7.c** Normalise responses:  
- List endpoints: expose `Count`, `Results`, pagination (`Page`) per contract  
- Include `Url` fields when helpful for follow-up reads  
**7.d** **projekt_statusz_valtas:** send **only** `StatusId` (and path `Id`) — do not send other project fields (scope).  
**7.e** **No delete:** do not call `PurgePerson`, `Deleted: 1` on cards, or DELETE endpoints as tools.  
**7.f** Handle **empty** `Results` as success with explicit “Nincs találat” style message in output payload.

**Reference endpoints (verify against your Phase 1 samples):**

| Tool | Typical API (from scope + manual) |
|------|-----------------------------------|
| kontakt_kereses | GET `/Api/R3/Contact?...` |
| kontakt_lekeres | GET `/Api/R3/Contact/{Id}` |
| kontakt_letrehozas | PUT `/Api/R3/Contact` |
| kontakt_modositas | PUT `/Api/R3/Contact/{Id}` |
| projekt_kereses | GET `/Api/R3/Project?...` |
| projekt_lekeres | GET `/Api/R3/Project/{Id}` |
| projekt_letrehozas | PUT `/Api/R3/Project` |
| projekt_statusz_valtas | PUT `/Api/R3/Project/{Id}` |
| teendo_letrehozas | POST or PUT `/Api/R3/ToDo/` — **as verified in Phase 1** |
| teendo_lekeres | GET `/Api/R3/ToDoList/{CardId}` |
| szamla_lekerdezes | GET `/Api/Invoice` |
| schema_lekerdezes | GET `/Api/R3/Category` + GET `/Api/R3/Schema/...` |

---

### Step 8 — Input validation

**8.1** JSON Schema for each tool (types, required, enums where known).  
**8.2** Reject unknown fields **or** strip them — pick one policy and document.  
**8.3** For numeric ids, validate positive integers where applicable.  
**8.4** For dates, align with manual formats (Hungarian timezone noted for some Contact queries).

---

### Step 9 — Unit tests (mandatory scope)

**For each of the 12 tools**, add tests that **mock** the HTTP layer:

| Test case | Expectation |
|-----------|-------------|
| **Success** | Handler returns structured success; parser handles typical JSON from Phase 1 samples |
| **Bad input** | Missing required arg → validation error before HTTP |
| **API 400** | Mapped Hungarian error; no crash |
| **Empty results** | Clear message, no exception |
| **429** | Retries or surfaced message per design |

**9.1** Use a test framework (Vitest, Jest, Node test runner).  
**9.2** Keep tests **fast** — no network by default.

---

### Step 10 — Integration smoke (optional)

**Before:** Client approves hitting live API from dev machine.

**10.1** Script or `npm run smoke` that calls each tool once with **safe** parameters (read-only preferred).  
**10.2** Record output in `smoke-results-phase2.md` (redact PII).

---

### Step 11 — Packaging for Claude Desktop (prepare only)

**Not full Phase 3** — only ensure:

- Build produces single entry file or command documented in README.  
- Example command: `node path/to/dist/index.js` with env loaded.  
- This command will be pasted into `claude_desktop_config.json` in Phase 3.

---

### Step 12 — Internal review before M2 demo

**Checklist:**

- [ ] All **12** tools registered and callable via MCP inspector (if used) or test harness  
- [ ] `npm test` passes  
- [ ] `.env` not in git; `.env.example` complete  
- [ ] Rate limiter unit tests pass  
- [ ] `projekt_statusz_valtas` cannot accidentally update unrelated fields (code review)  
- [ ] README documents run + test

---

### Step 13 — Gate M2

**Acceptance (from scope):** Working MCP server locally; all 12 tools **unit-tested**; each tool returns **correct** results on test data / mocks.

**Demo script (suggested):**  
For each tool, show: input → output (mock or live). Show one **429** simulation.

**Sign-off:** Stakeholder or tech lead confirms M2 criteria.

**If failed:** Open defects; fix; re-run tests; repeat gate.

---

## 7. Outputs summary (Phase 2)

| Output | Note |
|--------|------|
| Source code | Full 12 tools + limiter + client |
| Unit tests | All tools covered |
| `.env.example` | No secrets |
| README | Build, run, test, env vars |
| Optional smoke log | If integration allowed |

---

## 8. Handoff to Phase 3

Before starting Phase 3:

- [ ] M2 complete  
- [ ] Stable **git tag** or release branch for handover candidate  
- [ ] **Run command** for MCP server documented  
- [ ] Known limitations list (e.g. invoice query params not supported by tenant)

Phase 3 will need: **built artifacts**, **Claude Desktop**, **Projects**, and **system prompt** content.

---

## 9. Common pitfalls

- **UserId** on Project: manual allows name or id; typos may still return 200 with wrong assignee — document in README for prompt authors.  
- **Invoice** rate limit differs from R3 — avoid assuming unlimited.  
- Encoding / special characters in Hungarian text — enforce UTF-8.  
- Implementing **delete** “for convenience” — violates scope and security intent.

---

*End of Phase 2 runbook.*
