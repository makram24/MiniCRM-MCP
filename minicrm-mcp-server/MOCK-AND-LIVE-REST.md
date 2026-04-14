# Before REST API access, the switch, and after

This document describes how the MCP server behaves **without** a working miniCRM REST key, how to **flip** to live API, and what to do **after** the key is active. Scope reference: `docs/Teszt-Projekt-MCP.md`.

---

## 1. Before REST API (mock mode)

Use this while waiting for **Professional + REST API add-on** credentials, or when you want offline development.

| Topic | Detail |
|--------|--------|
| **Environment** | Set `MINICRM_USE_MOCK=true` in `minicrm-mcp-server/.env`. |
| **Credentials** | `MINICRM_SYSTEM_ID` and `MINICRM_API_KEY` are **not** required. |
| **Network** | No HTTPS calls to miniCRM; responses come from `fixtures/*.json`. |
| **Purpose** | Implement and exercise all **12 tools** in Claude Desktop, align prompts and flows, and keep the repo merge-ready without live data. |
| **Limitation** | JSON shapes are **document-based / illustrative**. They are not tenant-specific. After go-live, replace or refine using real `api-samples` (Deliverable 0). |

**Run locally**

```bash
npm run build
npm start
```

Or `npm run dev` while developing.

Tool outputs are prefixed with `[Mock]` when mock mode is on.

---

## 2. The switch (mock → live)

When REST access is confirmed (SystemId + API key work in miniCRM / support):

1. Open `minicrm-mcp-server/.env`.
2. Set **`MINICRM_USE_MOCK=false`** (or remove the line; default is live).
3. Set **`MINICRM_SYSTEM_ID`** — Basic auth **username**.
4. Set **`MINICRM_API_KEY`** — Basic auth **password** (the REST API key, not other product keys).
5. Keep **`MINICRM_BASE_URL`** as `https://r3.minicrm.hu` unless your tenant uses another documented host.
6. Optional: **`MINICRM_RATE_LIMIT_PER_MINUTE=60`** — matches scope (60 requests/minute); adjust only if you have a documented different limit.

**Claude Desktop:** Restart the MCP server process (or Claude) so the new environment is picked up.

**Security:** If a key was ever shared in chat or committed by mistake, **rotate** it in miniCRM before relying on it in production.

---

## 3. After REST API (live mode)

| Step | Action |
|------|--------|
| **Smoke test** | From `minicrm-mcp-server`, run `npm run smoke:api`. Expect **2xx** on all steps. If you get **401**, see `docs/deliverable-0/api-samples/README.md` (auth checklist). |
| **Save samples** | With working auth: `SMOKE_SAVE=1` (see smoke script header) to populate `docs/deliverable-0/api-samples/` for contract and schema work. |
| **MCP sanity** | In Claude Desktop, run a **read-only** tool first (e.g. `schema_lekerdezes` or `projekt_kereses` with a narrow filter). |
| **Writes** | Keep **confirm-before-execute** in the project system prompt; write tools: `kontakt_letrehozas`, `kontakt_modositas`, `projekt_letrehozas`, `projekt_statusz_valtas`, `teendo_letrehozas`. |
| **Rate limit** | The server enforces a sliding window in live mode; heavy bulk flows should stay within **60/min** per scope. |

**Invoice listing note:** `szamla_lekerdezes` calls **`GET /Api/Invoice/List`** (Integrations Manual). If your tenant or docs differ, adjust the handler once you have a verified response.

**ToDo create note:** Scope/manual often shows **`POST /Api/R3/ToDo/`**; **this tenant’s live API uses `PUT /Api/R3/ToDo/`** (POST →405). Evidence: `docs/deliverable-0/api-samples/08-todo-probe-*.json` and `api-test-log.md`. MCP tool `teendo_letrehozas` uses **PUT**.

---

## Quick reference

| Mode | `MINICRM_USE_MOCK` | SystemId / API key |
|------|--------------------|--------------------|
| Before REST | `true` | Optional |
| After REST | `false` | Required |

Related: `README.md`, `.env.example`, `docs/deliverable-0/`, `docs/phases/Phase-01-*.md`, `Phase-02-*.md`.
