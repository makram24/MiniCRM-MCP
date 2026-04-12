# Phase 5 — Handover and self-service installation

**Milestone:** M5 — Handover complete  
**Scope reference:** `Teszt-Projekt-MCP.md` → “Phase 5: Handover and self-service installation handover”  
**Deliverables reference:** `Teszt-Projekt-MCP.md` → “Deliverables and acceptance criteria” (#0–6)  
**Companion overview:** `Teszt-Projekt-MCP-Implementation-Plan.md`

Standalone runbook for **Phase 5 only**: final **demo**, complete **artefact package**, **installation guide** so the client installs **without** your help (or with minimal support), **command examples**, **troubleshooting**, **data-handling** notes, **handover minutes**, **M5 sign-off**.

---

## 1. Purpose of Phase 5

- Demonstrate the **full system** on **real** miniCRM data (final demo).  
- Deliver: **source code**, **configuration templates**, **installation guide**, **≥ 15** command examples, **≥ 5** troubleshooting cases, **handover minutes** with signatures.  
- Confirm **Deliverables 1–6** from scope (Deliverable 0 was Phase 1 — include in package as reference).  
- **Gate M5:** Client **successfully installs** using **only** the guide (scope acceptance) and **approves** based on demo.

---

## 2. Before you start Phase 5 (hard prerequisites)

| # | Prerequisite | Verify |
|---|----------------|--------|
| P5.1 | **M4 complete** and signed | Quality checklist approved |
| P5.2 | **Release candidate tag** (e.g. `m4-rc1` or `v1.0.0`) | Git tag points to tested commit |
| P5.3 | **No secrets** in repository | Grep for keys; run `git log` review if needed |
| P5.4 | **`npm test` green** on clean checkout | CI or manual `npm ci && npm test` |
| P5.5 | **README** accurate for build/run | Dry run on a **clean** machine or VM if possible |
| P5.6 | **Demo script** prepared | Ordered steps, data to show |
| P5.7 | **Legal**: licence / IP ownership of deliverables clear | Contract |

**Before client self-install test:**

| # | Item |
|---|------|
| P5.8 | Client machine has **Node LTS** (or guide installs it). |
| P5.9 | Client has **Admin** rights to edit Claude Desktop config folder. |
| P5.10 | Client has **miniCRM credentials** ready for `.env`. |

---

## 3. Dependencies on previous phases

| Phase | Artefacts Phase 5 packages |
|-------|----------------------------|
| **Phase 1** | Deliverable 0 (schema discovery) — attach as reference PDF/zip |
| **Phase 2** | Source, tests, `.env.example`, README |
| **Phase 3** | `claude_desktop_config.example.json`, `system-prompt.md`, pilot logs (optional appendix) |
| **Phase 4** | Quality checklist, troubleshooting notes from validation |

---

## 4. Roles

| Role | Tasks |
|------|--------|
| Implementer | Package zip/repo access, guide writing, demo |
| Client | Self-install attempt, sign handover |
| Witness (optional) | Second signature on minutes |

---

## 5. Bundle structure (recommended)

Create `release/minicrm-mcp-handover/` (or GitHub release assets):

```
minicrm-mcp-handover/
├── README.md                    (copy or symlink to repo root README)
├── INSTALL.md                   (step-by-step — scope Deliverable 4)
├── docs/
│   ├── deliverable-0-schema/    (Phase 1 package)
│   ├── prompts/system-prompt.md
│   ├── claude_desktop_config.example.json
│   ├── command-examples.md      (≥ 15) — Deliverable 5 part A
│   ├── troubleshooting.md       (≥ 5) — Deliverable 5 part B
│   ├── data-handling.md         (secrets, rotation, GDPR note)
│   └── quality-metrics-checklist.md (M4)
├── source/                      (full repo zip OR git URL + tag instruction)
└── HANDOVER-MINUTES-template.md
```

Adjust to match your repo layout; **do not omit** required deliverable content.

---

## 6. Step-by-step work

### Step 1 — Freeze release

**Before packaging:**

1.1 Merge all fixes to `main` (or release branch).  
1.2 Tag **`v1.0.0`** (or client-agreed version).  
1.3 `npm ci && npm run build && npm test`  
1.4 Export **zip** of source **excluding** `node_modules` (or document `npm ci`).  
1.5 Record **git commit hash** in `RELEASE-NOTES.md`.

---

### Step 2 — Write / polish `INSTALL.md` (Deliverable 4)

Must include **every** item the scope lists:

**2.1 Install Node.js**  
- Link to **LTS** download.  
- Verify: `node -v`, `npm -v`.

**2.2 Get the code**  
- Clone URL **or** unzip instructions.  
- `cd` into folder.

**2.3 Install dependencies**  
- `npm ci` (preferred) or `npm install`.

**2.4 Configure environment**  
- `cp .env.example .env`  
- Edit `.env`: explain **MINICRM_SYSTEM_ID**, **MINICRM_API_KEY** (names must match code).  
- Warn: **never** email keys; rotate if exposed.

**2.5 Build**  
- `npm run build` if applicable.

**2.6 Test server (optional sanity)**  
- Command to run server; expected “listening” or stdio note (MCP may show no port).

**2.7 Claude Desktop configuration**  
- OS-specific path to `claude_desktop_config.json` (document **Windows** and **macOS** separately if both supported).  
- Paste **example** from `docs/claude_desktop_config.example.json`.  
- Explain **absolute paths** to `node` and `dist/index.js`.  
- Explain **env** inheritance or wrapper script pattern.

**2.8 Restart Claude Desktop**  
- Full quit.

**2.9 Verify**  
- Open Project; confirm **12 tools**; run `schema_lekerdezes` or safe read.

**2.10 First successful CRM action**  
- One **read** and one **write** with confirmation (optional but builds confidence).

**Output:** `INSTALL.md` reviewed by someone **not** on the dev team (fresh eyes).

---

### Step 3 — Command examples (Deliverable 5a — ≥ 15)

Create `docs/command-examples.md`:

**For each example (minimum 15):**

- **Title** (short)  
- **Hungarian command** (exact text user can paste)  
- **Expected behaviour** (what Claude should do conceptually)  
- **Tools likely used** (informational)  
- **Note** if confirm/plan layer expected  

**Sources:**  
- Scope “Example use cases” table  
- Phase 3 pilot script  
- Phase 4 validation successes  

**Tailoring:** Examples must use **client’s** module names and realistic statuses (from Deliverable 0).

---

### Step 4 — Troubleshooting (Deliverable 5b — ≥ 5)

Create `docs/troubleshooting.md` with **at least 5** entries.

**Recommended topics (align with Integrations Manual + your validation):**

| # | Symptom | Likely cause | Fix steps |
|---|---------|--------------|-----------|
| 1 | MCP server does not appear | Wrong config path / JSON syntax | Validate JSON; restart Desktop |
| 2 | “Unauthorized” / 404 auth | Bad SystemId/key or subscription | Regenerate key; check Basic auth |
| 3 | 429 / too many requests | Rate limit | Wait; reduce parallel tools; see limiter |
| 4 | Empty search results | Wrong CategoryId/StatusId | Run schema_lekerdezes |
| 5 | Claude skips confirmation | Wrong chat / missing Project | Use correct Project; update prompt |
| 6 | Hungarian mixed with English | Prompt / tool labels | Update system-prompt.md |
| 7 | ToDo create fails | Method/body mismatch | Compare with Phase 1 verified note |

Each entry: **symptom → diagnosis → steps → escalate**.

---

### Step 5 — Data handling appendix

Create `docs/data-handling.md`:

- Store secrets **only** in `.env` and Claude config (if used); file permissions.  
- **Rotate** API key if exposed; update integrations.  
- **PII** in logs: what your server logs and how to disable debug.  
- **GDPR** high-level: data stays client machine → miniCRM; no third-party AI server for MCP tool execution path (scope) — phrase per your legal review.

---

### Step 6 — README (Deliverable 1 support)

Ensure root **README.md** contains:

- Project purpose (1 paragraph)  
- Requirements: Node version, Claude Desktop, subscriptions  
- Quick start → link to **INSTALL.md**  
- Scripts: `npm test`, `npm run build`, `npm start`  
- Licence (if applicable)

---

### Step 7 — Deliverable 2 & 3 final copies

**7.1** `docs/claude_desktop_config.example.json` — placeholders only.  
**7.2** `docs/prompts/system-prompt.md` — **final** text; note “copy into Claude Project”.  
**7.3** Optional: screenshot of **Project settings** (redacted) for client manual.

---

### Step 8 — Demo session (live)

**Before demo:**  
- Use **release tag** build.  
- Test **30 minutes before** on same machine.

**Demo flow (suggested 45–60 min):**

1. Show **architecture** slide (Client → Desktop → MCP → miniCRM).  
2. Show **12 tools** in UI.  
3. **Read-only** query.  
4. **Ambiguous** contact scenario → clarification.  
5. **Write** with **confirm**.  
6. **Multi-step** with **plan** then execute.  
7. **Invoice-related** read (if in scope).  
8. Q&A.

**Record:** attendees, date in handover minutes.

---

### Step 9 — Client self-install test (acceptance)

**Critical scope criterion:** Client installs **using the guide alone**.

**Process:**

9.1 Send **INSTALL.md** + zip **before** call.  
9.2 Client performs install **without** screen share for first N steps (if feasible).  
9.3 Client reports blockers — you may **only** point to **section numbers** in guide; update guide if steps were wrong.  
9.4 If guide was wrong, fix **INSTALL.md**, bump patch version, **re-tag**.

**Pass:** Client confirms “we can reinstall from docs.”

---

### Step 10 — Handover minutes (Deliverable 6)

Use `HANDOVER-MINUTES.md`:

- Project name, date, parties  
- **List of delivered artefacts** (with paths or URLs):  
  - Source (repo + tag)  
  - INSTALL.md  
  - command-examples.md  
  - troubleshooting.md  
  - system-prompt.md  
  - claude_desktop_config.example.json  
  - Deliverable 0 reference  
  - M4 quality checklist  
- **Known limitations**  
- **Support window** (scope: phone/email after handover — define hours if contractually)  
- **Signatures** (name, title, date)

---

### Step 11 — Gate M5

**Scope acceptance conditions:**

- Source and configuration **handed over**  
- **Demo** completed  
- **Installation guide** delivered  
- Client **approves** based on demo **and** successful self-install test

**If not met:** Iterate docs or code; repeat Step 9.

---

## 7. Deliverables checklist (scope #0–6)

| # | Deliverable | Phase 5 action |
|---|-------------|----------------|
| 0 | Schema discovery | Include in handover package (already from Phase 1) |
| 1 | MCP server source | Tag + zip / repo access |
| 2 | Claude Desktop configuration | `claude_desktop_config.example.json` + INSTALL section |
| 3 | System prompt | `system-prompt.md` + instruction to paste in Project |
| 4 | Installation guide | `INSTALL.md` |
| 5 | Command examples + troubleshooting | Two files, count ≥ 15 / ≥ 5 |
| 6 | Handover minutes | Signed |

---

## 8. After M5 (operational notes)

- **Optional maintenance package** (scope: separate) — if not sold, define **end of included support** date in minutes.  
- **API changes** by miniCRM: client uses optional support or applies patches from source.  
- **Versioning:** agree how client receives **patch releases** (git remote access).

---

## 9. Common pitfalls

- Zipping **`node_modules`** — huge, platform-specific; exclude.  
- **Relative paths** in install guide — fail on client machine.  
- Forgetting **Windows vs macOS** Claude config paths.  
- **15 examples** that are duplicates with different wording — scope asks for **real** variety; use distinct intents.  
- Signing minutes **before** self-install test passes.

---

## 10. Quick final verification list

- [ ] `v*` tag exists and matches handover  
- [ ] `npm ci && npm test` passes on clean clone  
- [ ] INSTALL.md tested by independent reader  
- [ ] ≥ 15 commands, ≥ 5 troubleshooting items  
- [ ] No secrets in repo or zip  
- [ ] Handover minutes signed  
- [ ] Client written approval (email acceptable if formal doc delayed)

---

*End of Phase 5 runbook.*
