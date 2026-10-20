# miniCRM MCP server

Local **Model Context Protocol (MCP)** bridge between **Claude Desktop** and the **miniCRM REST API**. Portfolio project by **Makram**: 12 Hungarian-named CRM tools, mock or live backends, rate limiting, and documented handover.

## Quick start (mock — no API key)

```bash
cd minicrm-mcp-server
cp .env.example .env
# set MINICRM_USE_MOCK=true in .env
npm ci
npm test
npm run build
npm start
```

Claude Desktop sample config: [`docs/claude_desktop_config.example.json`](docs/claude_desktop_config.example.json) (replace the absolute path placeholder; keep mock mode for demos).

## Agent operator skills (paid)

The MCP server is free. For production-safe agent behaviour (schema-first CategoryIds, confirm-before-write, multi-match contacts), use the operator skills:

- **English:** [SkillHQ](https://skillhq.dev/skills/makramalmoghrabi/minicrm-operator) · [BuySkills](https://app.buyskills.ai/plugins/makram24-minicrm-operator) — $24 · [Agensi](https://www.agensi.io/skills/minicrm-operator-safe-agent-crm-workflows)
- **Magyar:** [SkillHQ](https://skillhq.dev/skills/makramalmoghrabi/minicrm-operator-hu) · [BuySkills](https://app.buyskills.ai/plugins/makram24-minicrm-operator-hu) — $24 · [Agensi](https://www.agensi.io/skills/minicrm-oper-tor-biztons-gos-crm-gyn-k-munkafolyamat)

Building your own CRM MCP? See **CRM MCP Builder** — [SkillHQ](https://skillhq.dev/skills/makramalmoghrabi/crm-mcp-builder) · [BuySkills](https://app.buyskills.ai/plugins/makram24-crm-mcp-builder) — $39 · [Agensi](https://www.agensi.io/skills/crm-mcp-builder-mock-to-live-agent-bridge).

Operating any write MCP (not just miniCRM)? See **MCP Operator Generic** — [SkillHQ](https://skillhq.dev/skills/makramalmoghrabi/mcp-operator-generic) · [BuySkills](https://app.buyskills.ai/plugins/makram24-mcp-operator-generic) — $29 · [Agensi](https://www.agensi.io/skills/mcp-operator-confirm-before-write-for-any-server).

Skills are authored in a private skills monorepo; this repository stays the open MCP lead magnet.

## What’s included

| Path | Description |
|------|-------------|
| [`minicrm-mcp-server/`](minicrm-mcp-server/) | TypeScript MCP server (stdio), 12 tools, mock/live REST |
| [`docs/phases/`](docs/phases/) | Phase runbooks (discovery → handover) |
| [`docs/deliverable-0/`](docs/deliverable-0/) | Contracts, UAT scripts, redacted API samples |
| [`docs/prompts/system-prompt.md`](docs/prompts/system-prompt.md) | Claude Project system prompt (confirm-before-write) |

## Stack

- Node.js 18+, TypeScript (strict), Zod
- `@modelcontextprotocol/sdk` (stdio transport)
- miniCRM HTTPS + Basic auth when live; fixtures when `MINICRM_USE_MOCK=true`
- Sliding **60 req/min** limiter, concurrency gate, 429 backoff

## Security notes

- **Never commit** `.env` or real Claude Desktop configs with keys.
- API samples under `docs/deliverable-0/api-samples/` are **redacted placeholders**, not live tenant dumps.
- Prefer secrets only in local `.env` (or the Windows launcher script) — not in shared JSON.
- If this repo was ever shared with a real API key or tenant dump, **rotate the miniCRM REST API key**.

## Docs

- Server README: [`minicrm-mcp-server/README.md`](minicrm-mcp-server/README.md)
- Scope: [`docs/Teszt-Projekt-MCP.md`](docs/Teszt-Projekt-MCP.md)
- Mock ↔ live: [`minicrm-mcp-server/MOCK-AND-LIVE-REST.md`](minicrm-mcp-server/MOCK-AND-LIVE-REST.md)
