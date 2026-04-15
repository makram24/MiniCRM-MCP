# Claude Desktop — Phase 3 prep (B3)

**Runbook:** `docs/phases/Phase-03-Claude-Desktop-Integration-and-Pilot.md` (Steps 1–5).  
**Sample JSON:** `docs/claude_desktop_config.example.json` (redacted — replace paths and secrets).

---

## 1. Where the config file lives

### Windows — open the folder in a few clicks

1. Press **Win + R** (Run dialog).  
2. Paste one of the paths below and press **Enter** — File Explorer opens that folder.

**Path A — classic (docs often cite this)**  

- Folder: `%APPDATA%\Claude`  
- Full file: `%APPDATA%\Claude\claude_desktop_config.json`  
- On disk that is usually: `C:\Users\<YourUser>\AppData\Roaming\Claude\`

**If Win+R says “Windows cannot find … Roaming\Claude”** — that folder does not exist yet. Either:

1. **Create it:** Open `%APPDATA%` (Win+R → type `%APPDATA%` → Enter), right-click → New → Folder → name it **`Claude`**, then create `claude_desktop_config.json` inside (see sample JSON below), **or**  
2. Skip Path A and use **Path B (MSIX)** below if you installed Claude from the Microsoft Store / MSIX installer.

**Path B — MSIX install (many Store-style Claude Desktop builds use this)**  

If **Path A** has no `claude_desktop_config.json` (or MCP changes never apply), try:

- `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\`

The middle folder name can vary slightly (`Claude_…_pzs8sxrjxfjjc`). To list matches in **PowerShell**:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Packages" -Filter "Claude*" -Directory
```

Then open: `…\Claude_<…>\LocalCache\Roaming\Claude\` and look for `claude_desktop_config.json`.

**If the file does not exist yet**  

Create the `Claude` folder if needed, then create **`claude_desktop_config.json`** with valid JSON, for example:

```json
{
  "mcpServers": {}
}
```

Save, then merge your `minicrm` entry (see `docs/claude_desktop_config.example.json`).

**From inside Claude Desktop**  

Settings → **Developer** (or **MCP**) → **Edit config** (wording varies by version).  
Note: on some Windows MSIX builds this has opened a **different** path than the one the app actually reads; if MCP never loads, use **Path B** above.

### macOS

`~/Library/Application Support/Claude/claude_desktop_config.json`

**Before editing:** back up the existing file if you already use MCP.

---

## 2. Replace placeholders in the sample

| Placeholder | Action |
|-------------|--------|
| `REPLACE_WITH_ABSOLUTE_PATH/...` | Full path to `minicrm-mcp-server/dist/index.js` (forward slashes OK on Windows in JSON). |
| `env` block | For **mock**: keep `MINICRM_USE_MOCK=true`; leave SystemId/API key empty. For **live**: set `MINICRM_USE_MOCK=false` and real values (or use a wrapper — below). |

The server loads `minicrm-mcp-server/.env` on startup (`dotenv` in `src/index.ts` resolves relative to `dist/`). You can keep secrets **only** in `.env` and omit them from JSON if you use a wrapper script.

---

## 3. Optional: wrapper script (no secrets in JSON)

If you prefer not to put `MINICRM_API_KEY` in `claude_desktop_config.json`, use a launcher that `cd`s to the server folder so **`minicrm-mcp-server/.env`** is loaded by the app.

**Windows:** `minicrm-mcp-server/scripts/start-mcp-for-desktop.cmd` (run `npm run build` first). In Desktop config:

```json
"mcpServers": {
  "minicrm": {
    "command": "C:\\full\\path\\to\\minicrm-mcp-server\\scripts\\start-mcp-for-desktop.cmd",
    "args": []
  }
}
```

Test the `.cmd` in **cmd.exe** first; it must block on stdio (no immediate exit).

---

## 4. After saving config

1. **Quit Claude Desktop fully** and reopen.  
2. Open a chat in a **Claude Project** (Phase 3 Step 6).  
3. Confirm **12 tools** appear with exact names (Phase-03 Step 5 checklist).  
4. Run one **read-only** tool (e.g. `schema_lekerdezes` with mock, or narrow `projekt_kereses` when live).

### First chat tests (mock mode — `MINICRM_USE_MOCK=true`)

Use a normal chat (or a Project). Claude must **call the MCP tool** (not guess). If it only describes what it would do, ask again: *“Use the MCP tool … now.”*

**CategoryId note (mock vs live):** Mock fixtures may include a `"3"` (or similar) category. **Live tenants** often **do not** have `3` — use a key returned from the **`Category`** object (same response) e.g. `Project/23`, `Project/38`. If schema returns HTTP **500** / plain-text “product does not exist”, pick another id from **`Category`**.

---

**Test 1 — schema (read-only, 2 internal requests)**

**You type (Hungarian example — mock):**

```text
Hívd meg az MCP schema_lekerdezes eszközt ezzel: sema_tipus = "Project/3". Írd ki a nyers JSON választ.
```

**You type (Hungarian — live, tenant-safe):**

```text
Hívd meg a schema_lekerdezes eszközt. Először nézd meg a Category kulcsokat a válaszban, majd hívd meg úgy, hogy sema_tipus egy létező Project/{CategoryId} legyen (pl. Project/23). Nyers JSON.
```

**Or English:**

```text
Call schema_lekerdezes with sema_tipus set to a Project/{CategoryId} that exists in the Category map; show raw JSON.
```

**What you should see:**

- Text starting with **`[Mock]`** (mock mode).  
- JSON with two top-level parts: **`Category`** (module id → name, e.g. `"1":"Sales"`, `"3":"Helpdesk"`) and **`Schema`** (field-like keys from the fixture).  
- If you see **no** `[Mock]` and an error about HTTP/auth, mock is off or the server failed.

---

**Test 2 — contact search (read-only)**

**You type:**

```text
Használd a kontakt_kereses eszközt: nev = "test". Mutasd a JSON-t.
```

**Or:**

```text
Use kontakt_kereses with nev = "test" and show the JSON.
```

**Note:** The tool parameter for name is **`nev`** (maps to API `Name`).

**What you should see:**

- **`[Mock]`** + JSON with **`Count`** and **`Results`** (fixture has at least one sample contact such as John Doe / id 37147).

---

**Test 3 — project list (read-only)**

**You type (mock — matches fixture):**

```text
Futtasd a projekt_kereses eszközt kategoria_id = 3 és oldal = 0 értékekkel. JSON eredmény kell.
```

**You type (live):** use a **`kategoria_id`** from your **`GET /Api/R3/Category`** / `schema_lekerdezes` Category keys (example: `23`).

**What you should see:**

- **`[Mock]`** + project list JSON (`Count`, `Results`, etc. from fixtures).

---

**Test 4 — write tool (mock still returns fake Id — optional)**

**You type:**

```text
Csak akkor hívd a kontakt_letrehozas eszközt, ha előbb leírod pontosan mit küldesz, és én azt írom: IGEN. Teszthez küldj egy minimális mezok objektumot: FirstName: Teszt, LastName: MCP, Type: Person.
```

After you reply **IGEN**:

**Expect:** `[Mock]` + JSON like **`{ "Id": 99999 }`** (fixture behaviour — no real CRM write in mock).

---

**If something fails**

| Symptom | Likely cause |
|---------|----------------|
| No tools / “cannot connect” | Wrong `claude_desktop_config.json` path (MSIX vs Roaming), bad JSON, or `node` / path to `dist\index.js` wrong. Run `npm run build` again. |
| Immediate disconnect | Server crash — run `node dist\index.js` in a terminal (it will “hang”; Ctrl+C stops). Fix errors shown. |
| 401 / real error text | Mock off or missing/wrong `MINICRM_SYSTEM_ID` / `MINICRM_API_KEY` in **`minicrm-mcp-server/.env`** or overridden empty `env` in Desktop JSON. Regenerate API key in miniCRM if needed. |
| MCP “invalid JSON” / parse error on startup | Non-JSON on stdout (fixed in server: `dotenv` quiet). Rebuild server; ensure no `console.log` in hot path printing before MCP handshake. |
| `schema_lekerdezes` shows `schemaHttp: 500` | **`Project/{id}`** uses a **non-existent** CategoryId for your tenant — pick an id from the **`Category`** map in the same response. |
| 429 “Too many requests” | Exceeded **60 req/min** on R3; wait and retry — server auto-retries a few times. |

---

## 5. Security

Single-user local scope still means: restrict file permissions on config and `.env`; do not commit real keys; rotate if exposed.

---

## 6. First successful run — pass signals (live)

Use after `MINICRM_USE_MOCK=false` and valid `.env`.

| Step | Action | Pass signal |
|------|--------|-------------|
| 1 | `cd minicrm-mcp-server` → `npm run build` | `tsc` exits **0** |
| 2 | `npm run smoke:api` | All lines **200** in summary; no “Non-2xx” |
| 3 | Quit Claude fully → reopen | **12** tools listed for `minicrm` |
| 4 | Ask Claude to run `schema_lekerdezes` with valid `Project/{CategoryId}` | JSON with **`Category`** + **`Schema`**, no `isError` |
| 5 | `projekt_kereses` with real `kategoria_id` | `Count` / `Results` JSON |

---

## 7. Prerequisites (formal Phase 3)

Per Phase-03: M2 complete, built server, Pro/Team, Projects, valid `.env` for live pilot, glossary from Deliverable 0. **Deliverable 0 pack:** `EXECUTIVE-SUMMARY-M1.md`, frozen `mcp-tool-contracts.md` (**v1.0-live**), `crm-structure-map.md`, `INTERNAL-QA-CHECKLIST.md`, `PILOT-EXECUTION-LOG.md` (fill on pilot day).
