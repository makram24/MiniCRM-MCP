# miniCRM MCP server

Local **Model Context Protocol** server for **miniCRM** (scope: `docs/Teszt-Projekt-MCP.md`).

## Status

- **12 CRM tools** are registered (contacts, projects, tasks, invoices, schema).
- **`MINICRM_USE_MOCK=true`** — responses come from `fixtures/*.json` (no network, no API key).
- **`MINICRM_USE_MOCK=false`** (default) — **HTTPS + Basic auth** to `MINICRM_BASE_URL`, with a **60/min** sliding rate limit (override via `MINICRM_RATE_LIMIT_PER_MINUTE`).

## Requirements

- Node.js **18+**

## Commands

```bash
npm ci
npm run build
npm start
```

Development (no separate build):

```bash
npm run dev
```

API smoke script (real credentials only):

```bash
npm run smoke:api
```

**Note:** Under Claude Desktop the process uses **stdin/stdout** for MCP. Use **stderr** only for logs (`console.error`).

## Environment

Copy `.env.example` to `.env`.

- **Mock development:** `MINICRM_USE_MOCK=true` — you can leave SystemId/API key empty.
- **Live:** `MINICRM_USE_MOCK=false`, plus `MINICRM_SYSTEM_ID`, `MINICRM_API_KEY`, optional `MINICRM_BASE_URL`.

## Related documentation

- **`MOCK-AND-LIVE-REST.md`** — before REST access (mock), switching env, after go-live checks
- `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`, `docs/phases/Phase-02-MCP-Server-and-Twelve-Tools.md`
- `docs/deliverable-0/` — Deliverable 0 templates and API samples
