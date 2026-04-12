# miniCRM MCP server

Local **Model Context Protocol** server for **miniCRM** (scope: `docs/Teszt-Projekt-MCP.md`).

## Current status: Phase 1 stub

Per **Phase 01** runbook (`docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`):

- This package proves **Node.js**, **TypeScript**, and **`@modelcontextprotocol/sdk`** with **stdio** transport.
- **No miniCRM REST calls** and **no CRM tools** are registered yet — that is **Phase 2**.

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

**Note:** When run under Claude Desktop, the process communicates on **stdin/stdout**. Do not pipe debug logs to stdout.

## Environment (Phase 2+)

Copy `.env.example` to `.env` and fill values. The Phase 1 stub does not read `.env` yet.

## Related documentation

- `docs/phases/Phase-01-Discovery-and-Schema-Mapping.md`
- `docs/deliverable-0/` — templates for **Deliverable 0** (schema discovery)
