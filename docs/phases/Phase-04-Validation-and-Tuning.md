# Phase 4 — Validation and tuning

**Milestone:** M4 — Validation complete  
**Scope reference:** `Teszt-Projekt-MCP.md` → “Phase 4: Validation and tuning”  
**Companion overview:** `Teszt-Projekt-MCP-Implementation-Plan.md`  
**Quality metrics reference:** `Teszt-Projekt-MCP.md` → “Quality target metrics”

Standalone runbook for **Phase 4 only**: formal validation against **acceptance criteria**, **edge cases**, **Hungarian quality**, **performance**, fixes and prompt iterations until **all** quality targets are met or **explicitly waived in writing**.

---

## 1. Purpose of Phase 4

- Measure **per-tool** and **end-to-end** success against scope **quality metrics**.  
- Execute **edge-case** tests (ambiguity, empty fields, rate limit, bad parameters).  
- Prove **100%** clarification behaviour when **≥ 2** matching contacts.  
- Prove **100%** **confirm-before-execute** on **every write tool**.  
- Sample **Hungarian** response quality (**≥ 95%** target).  
- Measure **response times** (&lt; 15 s simple, &lt; 30 s complex).  
- **Fix** bugs (server + prompt) and **freeze** a release candidate for handover (Phase 5).

---

## 2. Before you start Phase 4 (hard prerequisites)

| # | Prerequisite | Verify |
|---|----------------|--------|
| P4.1 | **M3 passed** | Written record; ≥90% pilot |
| P4.2 | **Stable build** from Phase 3 (tag/commit) | Git tag `m3-pilot` or similar |
| P4.3 | **Claude Desktop + Project** still working | Smoke: one read tool |
| P4.4 | **Pilot log** and **functional matrix** from Phase 3 exist | Files in `docs/` |
| P4.5 | **miniCRM access** still valid | API smoke |
| P4.6 | **Time** for focused validation sessions | Scheduled |

**Before edge-case tests that create data:**

| # | Preparation |
|---|-------------|
| P4.7 | Agree **test data naming** (e.g. prefix `[Val4]`) and **cleanup policy** (manual delete in UI allowed — not via MCP). |
| P4.8 | Optional: use **miniCRM test environment** for destructive edge cases if available. |

---

## 3. Dependencies on previous phases

| Phase | What Phase 4 uses |
|-------|-------------------|
| **Phase 1** | Schema, field rules, discrepancy notes |
| **Phase 2** | Server behaviour, rate limiter, error messages |
| **Phase 3** | System prompt, Desktop config, pilot baseline |

---

## 4. Roles

| Role | Tasks |
|------|--------|
| Tester | Executes matrices, records results |
| Developer | Fixes code |
| Prompt author | Fixes Claude Project text |
| Client | Approves waivers if any metric cannot be met |

---

## 5. Materials

- [ ] `validation-log-template.md` (one row per test case)  
- [ ] Stopwatch or screen recording timestamps  
- [ ] List of **write tools** for approval audit: `kontakt_letrehozas`, `kontakt_modositas`, `projekt_letrehozas`, `projekt_statusz_valtas`, `teendo_letrehozas`  
- [ ] Hungarian language rubric (simple: 0 = not HU, 1 = mixed, 2 = fully HU)  

---

## 6. Step-by-step work

### Step 1 — Baseline regression (quick)

**Before deep testing:**

1.1 Re-run **3** pilot commands that previously **passed** (1 read-heavy, 1 write with confirm, 1 multi-step).  
1.2 If any **fail**, stop and fix **before** proceeding (regression).

**Output:** `regression-check.md` with pass/fail.

---

### Step 2 — Per-tool success rate measurement

**Goal:** Scope says check acceptance criteria per tool — aggregate from logs.

**2.1** For each of the **12 tools**, run **at least 3** intentional calls:

- One **typical** success path  
- One **empty result** path (e.g. search with nonsense string)  
- One **invalid input** path (schema validation or API 400)

**2.2** Record in `tool-validation-matrix.md`:

| Tool | Attempts | Successes | Notes |

**2.3** Target: **no tool** has **zero** successful path in live environment; fix any systematic failure.

---

### Step 3 — Edge case: ambiguous contacts (100% clarification)

**Before:** Create **two** contacts in miniCRM UI (or one existing pair) with **same surname** or same email pattern as needed so `kontakt_kereses` returns **≥ 2** results.

**3.1** User command (Hungarian): “Módosítsd X kontakt telefonszámát…” where X is ambiguous.  
**3.2** **Expected:** Claude **does not** call `kontakt_modositas` until user picks **Id**.  
**3.3** Repeat with **2** different ambiguous queries.  
**3.4** **Pass criterion:** **100%** of runs ask for disambiguation.

**If fail:** Strengthen system prompt; consider tightening `kontakt_kereses` output format to always list Ids prominently; re-test until 100%.

---

### Step 4 — Edge case: empty fields and invalid enums

**4.1 Empty optional vs required**  
- Attempt `projekt_letrehozas`-style flow with **missing** required field (per tenant rules).  
- **Expected:** Clear Hungarian error; no partial orphan records (verify in CRM).

**4.2 Invalid StatusId**  
- `projekt_statusz_valtas` with **non-existent** id.  
- **Expected:** API error surfaced in Hungarian.

**4.3 Invalid tool arguments**  
- Omit required JSON field in MCP call (if test harness allows) — server returns validation error.

---

### Step 5 — Edge case: rate limit (429)

**Before:** Temporarily lower limiter in **dev build** to e.g. **5/min** **or** run a script that spams parallel reads (only on non-prod or with approval).

**5.1** Trigger **429** or limiter block.  
**5.2** **Expected:** User sees **Hungarian** message; system **recovers** after wait (retry or guidance).  
**5.3** Document behaviour in troubleshooting (feeds Phase 5).

**After:** Restore production limiter config (**60/min**).

---

### Step 6 — Approval audit (100% on writes)

**For each write tool**, run **one** successful operation:

| Write tool | Test action |
|------------|-------------|
| kontakt_letrehozas | Create disposable test contact |
| kontakt_modositas | Change single field on test contact |
| projekt_letrehozas | Create minimal project if business rules allow |
| projekt_statusz_valtas | Change status on disposable test project |
| teendo_letrehozas | Create task on a project |

**Per test:**  
- **Pass** only if Claude **explicitly** showed what it would do **before** the tool ran.  
- If model skipped confirmation: **fail** prompt layer; fix and **re-run all five**.

**Output:** `approval-audit.md` — each tool Y/N.

---

### Step 7 — Hungarian language sampling (≥ 95%)

**7.1** Collect **20** Claude **final** replies from mixed tests (copy to `hungarian-sample.md` without sensitive data).  
**7.2** Score each 0/1/2 per rubric (see Materials).  
**7.3** Compute: `fully_hungish_count / 20` ≥ **0.95**.  
**7.4** For failures: adjust prompt (“minden mondat magyarul”) and tool output labels (Phase 2 patch if needed).

---

### Step 8 — Performance timing

**8.1 Simple read** (e.g. one `projekt_kereses` + summary): measure **user send → final answer** — target **&lt; 15 s** (scope).  
**8.2 Complex** (e.g. invoice query + project fetch + task creation plan): target **&lt; 30 s**.  
**8.3** Run **3** samples each; record median in `performance-notes.md`.

**If exceeded:** Optimise prompt to reduce redundant tool calls; add short caching for schema; batch reads — document trade-offs.

---

### Step 9 — Bug fix and stabilisation

**9.1** Triage all failures from Steps 1–8: **server** vs **prompt** vs **user** vs **data**.  
**9.2** Fix **code** bugs; add **regression tests** in Phase 2 test suite.  
**9.3** Fix **prompt**; export updated `system-prompt.md` to repo.  
**9.4** Create **git tag** e.g. `m4-rc1` when stable.

---

### Step 10 — Map results to scope “Quality target metrics”

Fill `quality-metrics-checklist.md`:

| Metric | Target | Result | Evidence file |
|--------|--------|--------|---------------|
| Successful command rate | ≥ 90% first try | | pilot + validation logs |
| Clarification accuracy | 100% if ≥ 2 matches | | Step 3 |
| Approval execution | 100% before writes | | Step 6 |
| Avg response time | &lt; 15s / &lt; 30s | | Step 8 |
| Hungarian responses | ≥ 95% | | Step 7 |
| Handover doc completeness | Phase 5 will finish | | N/A here |

**Waivers:** If any target cannot be met, obtain **written** stakeholder waiver **before** claiming M4 — scope allows only explicit waiver, not silent skip.

---

### Step 11 — Gate M4

**Acceptance (from scope):** All acceptance criteria satisfied; bugs fixed; feedback incorporated.

**Sign-off meeting:**  
- Present `quality-metrics-checklist.md`  
- Demo **ambiguous contact** test  
- Demo **write approval**  
- Show **performance** numbers

**Outcome:** **Proceed to Phase 5** or continue iteration.

---

## 7. Outputs summary (Phase 4)

| Output | Purpose |
|--------|---------|
| tool-validation-matrix.md | Per-tool health |
| approval-audit.md | 100% write gate |
| hungarian-sample.md | Language metric |
| performance-notes.md | Latency |
| quality-metrics-checklist.md | M4 sign-off |
| Git tag m4-rc* | Handover candidate |

---

## 8. Handoff to Phase 5

Before Phase 5:

- [ ] M4 signed off  
- [ ] Release candidate **tagged**  
- [ ] `system-prompt.md` and server **match** tagged version  
- [ ] Known limitations / waivers documented  
- [ ] Seeds for **≥ 15** user commands and **≥ 5** troubleshooting entries collected during validation

Phase 5 packages everything for the **client self-install** and **sign-off**.

---

## 9. Common pitfalls

- Testing in a **chat without Project** → false failures for Hungarian/behaviour.  
- **Cleaning** test data via MCP — delete tools are **out of scope**; use UI.  
- Declaring M4 pass with **single** ambiguous test — need **consistent** 100% behaviour.  
- Ignoring **median** latency spikes — document if network or miniCRM slowness dominates.

---

*End of Phase 4 runbook.*
