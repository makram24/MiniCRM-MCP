# Phase 3 — Claude Desktop integration, system prompt, and pilot

**Milestone:** M3 — Claude Desktop pilot run  
**Scope reference:** `Teszt-Projekt-MCP.md` → “Phase 3: Claude Desktop integration, system prompt, and pilot”  
**Companion overview:** `Teszt-Projekt-MCP-Implementation-Plan.md`  
**API reference:** `MiniCRM-Integrations-Manual.md` (indirect — behaviour is mostly Claude + MCP)

Standalone runbook for **Phase 3 only**: wire **Claude Desktop** to your MCP server, author **Claude Projects** system prompt (three behaviour layers), run **10–15 pilot** commands on **live** data, document results, tune prompts.

---

## 1. Purpose of Phase 3

- Configure **`claude_desktop_config.json`** so Claude Desktop **starts** your MCP server and **lists all 12 tools**.  
- Implement the **three intelligent behaviour layers** via **system prompt engineering** (not new server code):  
  - **Confirm-before-execute**  
  - **Plan-then-execute**  
  - **Persistent memory** (CRM structure in Projects)  
- Execute **10–15 natural-language pilot commands** in **Hungarian** against **live** miniCRM data.  
- Document **functional** success/failure per tool.  
- **Tune** prompts from pilot feedback.  
- **Gate M3:** ≥ **90%** of pilot commands succeed on **first try**; both approval layers **demonstrated**.

---

## 2. Before you start Phase 3 (hard prerequisites)

| # | Prerequisite | Why | Verify |
|---|----------------|-----|--------|
| P3.1 | **M2 complete** and signed | Server must be feature-complete | M2 sign-off |
| P3.2 | **Built MCP server** (or `npm run build` reproducible) | Desktop launches a real command | Run locally once |
| P3.3 | **Claude Pro or Team** subscription | Projects + Desktop per scope | Account billing |
| P3.4 | **Claude Desktop** installed on pilot machine | Host for MCP | App opens |
| P3.5 | **Claude Projects** available | System prompt / persistent memory | Create a test project |
| P3.6 | **`.env`** on pilot machine with valid miniCRM credentials | Tools must call API | Same vars as Phase 2 |
| P3.7 | **Phase 1 glossary** and **module/status map** | Prompt accuracy | In Deliverable 0 |
| P3.8 | **Stakeholder** available for pilot session(s) | Approvals and realistic commands | Calendar |

**Before pilot on live data:**

| # | Check |
|---|--------|
| P3.9 | Stakeholder **accepts** pilot may create/update real contacts/projects/tasks (no deletes in scope — still, writes are real). |
| P3.10 | **Backup / awareness:** pilot uses identifiable test markers in `Comment` or `Name` where useful (e.g. “[MCP pilot]”) unless client forbids. |

**Not required for Phase 3 start**

- Phase 4 formal edge-case matrix (that is Phase 4).  
- Final handover guide polish (Phase 5).

---

## 3. Dependencies on previous phases

| Phase | What Phase 3 consumes |
|-------|----------------------|
| **Phase 1** | Business vocabulary, CategoryId/StatusId names, tool behaviour intent, example use cases table from scope |
| **Phase 2** | Runnable server, 12 tool names, Hungarian tool descriptions, stable JSON outputs |

---

## 4. Roles

| Role | Responsibility |
|------|------------------|
| Integrator | Desktop config, prompt authoring, logging pilot |
| Client / power user | Runs realistic Hungarian commands, approves writes |
| Reviewer | Confirms confirm/plan layers appeared |

---

## 5. Materials

- [ ] Path to **Node** executable on pilot OS (Windows: `where node`)  
- [ ] Path to **server entry** (e.g. `dist/index.js`)  
- [ ] Template **`claude_desktop_config.json`** (official Anthropic structure for MCP servers)  
- [ ] New **Claude Project** named per client convention  
- [ ] Spreadsheet **`pilot-log.md`** or CSV: command #, text, pass/fail, tools invoked, notes  

---

## 6. Step-by-step work

### Step 1 — Confirm Claude Desktop version (scope risk #7)

**Before config:**

1.1 Open Claude Desktop → About → note version and OS.  
1.2 Compare with current Anthropic documentation for **local MCP** support.  
1.3 If outdated, **update** Desktop before spending time on debugging.

**Output:** `environment-notes.md` updated (Desktop version, date).

---

### Step 2 — Build production entrypoint

**Before Desktop wiring:**

2.1 On the **pilot machine**, `git pull` the M2-tagged revision.  
2.2 `npm ci` or `npm install`  
2.3 `npm run build` (if TypeScript)  
2.4 Run **manually** once: `node ...` with env loaded — confirm process stays alive (stdio MCP blocks).

---

### Step 3 — Environment variables on the pilot machine

**3.1** Create `.env` in the server directory (or use system env vars — document which).  
**3.2** Ensure Claude Desktop **child process** inherits env:

- Some setups require wrapping in a small script that loads `dotenv` then starts Node (if Desktop does not load `.env`).  
- **Test:** add temporary log line (remove after) or use MCP `logging` if implemented.

**3.3** Document in internal notes: **absolute paths** matter on Windows vs macOS.

---

### Step 4 — Author `claude_desktop_config.json`

**Before editing:** Back up existing config if the user already uses MCP.

**4.1** Locate config path (OS-specific; see Anthropic Claude Desktop docs — typically user profile folder).

**4.2** Add an `mcpServers` entry, for example:

```json
{
  "mcpServers": {
    "minicrm": {
      "command": "node",
      "args": ["C:/absolute/path/to/your/project/dist/index.js"],
      "env": {
        "MINICRM_SYSTEM_ID": "12345",
        "MINICRM_API_KEY": "your-key-here"
      }
    }
  }
}
```

**Security note:** Putting keys in JSON may be acceptable for a **single-user local** machine; scope prefers `.env` — if you use `env` block, document **file permissions** and that the file is **not** shared. Alternative: wrapper script that reads `.env` so JSON has no secrets.

**4.3** Restart Claude Desktop completely (quit app, reopen).

**4.4** Open developer tools or MCP status UI if available; confirm server **connected** and **no crash** on start.

**Deliverable 2 (scope):** Final config documented for handover — in Phase 3, save a **redacted copy** as `docs/claude_desktop_config.example.json` (placeholders for paths/secrets).

---

### Step 5 — Verify 12 tools visible in Claude

**5.1** Start a new chat in the **Claude Project** you will use (Step 6).  
**5.2** Ask Claude to list available MCP tools (or use UI tool picker if present).  
**5.3** Checklist — all names exact:

- kontakt_kereses, kontakt_lekeres, kontakt_letrehozas, kontakt_modositas  
- projekt_kereses, projekt_lekeres, projekt_letrehozas, projekt_statusz_valtas  
- teendo_letrehozas, teendo_lekeres  
- szamla_lekerdezes, schema_lekerdezes  

**5.4** Run **one read-only** tool (e.g. `schema_lekerdezes` or `projekt_kereses` with narrow filter).  
**5.5** If failure: check Desktop logs, server stderr, auth, rate limit.

---

### Step 6 — Create the Claude Project and system prompt (Deliverable 3)

**6.1 Create project**  
Name e.g. “miniCRM MCP — [Client]”.

**6.2 System prompt structure (recommended sections)**

**A. Szerep (Role)**  
- You assist with miniCRM via MCP tools.  
- User writes in **Hungarian**; you reply in **Hungarian**.

**B. Adatmodell (Data model)**  
- Paste **CategoryId → module display name** table from Phase 1.  
- Paste **key statuses** per module (human names + ids).  
- Note **custom fields** that appear often in commands.

**C. Viselkedés — megerősítés (Confirm-before-execute)**  
- Before calling **any write tool** (`kontakt_letrehozas`, `kontakt_modositas`, `projekt_letrehozas`, `projekt_statusz_valtas`, `teendo_letrehozas`):  
  - Summarise **exactly** what will be created/changed (fields, ids).  
  - Wait for **explicit** user confirmation (“igen”, “futtasd”, etc.).  
- If user is vague, ask clarifying questions **before** calling tools.

**D. Viselkedés — terv majd végrehajtás (Plan-then-execute)**  
- For **multi-step** or **bulk** workflows (many tasks, many status changes):  
  - First output a **numbered plan** and estimated tool calls.  
  - Wait for approval.  
  - Then execute stepwise; optionally re-confirm before large batches if client wants stricter control.

**E. Viselkedés — több találat (Ambiguous contacts)**  
- If `kontakt_kereses` returns **two or more** plausible matches:  
  - **Never** pick arbitrarily.  
  - Present list with **Id** and distinguishing fields; ask user to choose.

**F. Nyelv (Language consistency)**  
- Even if tool output contains English technical tokens, **summarise in Hungarian**.  
- Prefer quoting **status and module names** as users know them.

**G. Tiltások (Prohibitions)**  
- **No delete** operations; no purge; do not mark cards deleted.  
- Do not invent ids — only use ids from tool results.

**H. Tipikus parancsok (Examples)**  
- Paste **2–3** short example phrasings (not the full 15 — those are Phase 5 deliverable).

**6.3 Save** prompt text in repo as `docs/prompts/system-prompt.md` and copy into Claude Project UI (source of truth = Project UI; git copy for handover).

---

### Step 7 — Design the pilot script (10–15 commands)

**Before running pilot:** Write the **exact** Hungarian prompts in `pilot-script.md`.

**Coverage goals — map to scope “Example use cases”:**

| # | Intent (example) | Tools expected (rough) |
|---|------------------|-------------------------|
| 1 | List / search projects with filter | projekt_kereses, maybe projekt_lekeres |
| 2 | Open project detail + tasks | projekt_lekeres, teendo_lekeres |
| 3 | Create contact (then confirm) | kontakt_letrehozas |
| 4 | Update contact field (ambiguous name path) | kontakt_kereses, kontakt_modositas |
| 5 | Create task on a project | teendo_letrehozas |
| 6 | Query invoices + follow-up task plan | szamla_lekerdezes, projekt_lekeres, teendo_letrehozas |
| 7 | Schema question | schema_lekerdezes |
| 8 | Status change only | projekt_kereses, projekt_statusz_valtas |
| 9 | Multi-step “plan then execute” | multiple |
| 10–15 | Client-specific realistic tasks | varies |

**Each command must be testable** with **first-try** criterion: user issues command once without extra coaching.

---

### Step 8 — Run the pilot session

**Before session:**  
- Close unrelated chats; use **only** the configured Project.  
- Open `pilot-log` template.

**During each command:**

8.1 Record start time (for Phase 4 performance sampling).  
8.2 User types **only** the scripted command (unless clarifying question required).  
8.3 Observer notes:  
- Which tools called, in what order  
- Whether **confirm** appeared before writes  
- Whether **plan** appeared before multi-step  
- Pass/fail + reason  

8.4 On failure: capture whether fix is **prompt** vs **server** vs **user error**; tag follow-up.

**After session:**  
- Compute success rate: `passed_first_try / total`.  
- Must be **≥ 90%** for M3.

---

### Step 9 — Functional testing documentation (per tool)

Create `functional-matrix-phase3.md`:

| Tool | Success case observed (Y/N) | Failure case observed (Y/N) | Ticket id if failed |
|------|-----------------------------|-------------------------------|---------------------|

**Scope requires** documenting success/failure cases for **every** tool during pilot phases — fill gaps with targeted micro-tests if pilot did not touch a tool.

---

### Step 10 — Prompt and server tuning loop

**10.1** If Claude **skipped confirmation**: strengthen system prompt + add negative example.  
**10.2** If Claude **used wrong tool**: clarify tool descriptions (MCP metadata) **and** prompt rules.  
**10.3** If **English** leakage: add explicit “válaszolj magyarul” + improve Hungarian labels in tool outputs (Phase 2 patch if needed).  
**10.4** If **rate limit** hit: consider prompt guidance (“batch read with pagination”) or server cache for schema (Phase 2 patch).

Re-run **failed** pilot commands until pass or document as **known limitation**.

---

### Step 11 — Gate M3 (decision point)

**From scope:**  
- ≥ **90%** of 10–15 commands succeed **first try**.  
- **Both** approval layers (confirm-before-execute, plan-then-execute) **run** in relevant scenarios.

**Meeting:**  
- Show pilot log and percentage.  
- Demo one **write** with confirmation.  
- Demo one **multi-step** with plan.

**Outcomes:**  
- **Pass:** Proceed to Phase 4.  
- **Fail:** Iterate prompt/server; schedule **extra pilot**; do not start Phase 4 until pass or written scope change.

**Record** any **scope change** requests (per scope: capture at this gate).

---

## 7. Outputs summary (Phase 3)

| Output | Location / form |
|--------|------------------|
| Working Desktop + MCP | On pilot machine |
| `claude_desktop_config.example.json` | docs (redacted) |
| `system-prompt.md` | docs/prompts |
| `pilot-script.md` | docs |
| `pilot-log` | docs (redact PII) |
| `functional-matrix-phase3.md` | docs |

---

## 8. Handoff to Phase 4

Before Phase 4:

- [ ] M3 passed  
- [ ] Latest **prompt** and **server** revisions merged/tag  
- [ ] Known issues list exported  
- [ ] Sample timings captured (even rough) for performance targets

Phase 4 will **stress** edge cases and **measure** metrics formally.

---

## 9. Common pitfalls

- **Wrong working directory** in Desktop config → `.env` not found.  
- **Relative paths** to `node` or script break on Windows — use absolute.  
- User confirms in **free text** Claude misinterprets — define clear approval phrases in prompt.  
- Running pilot **outside** the Project → loses system prompt / memory context.

---

*End of Phase 3 runbook.*
