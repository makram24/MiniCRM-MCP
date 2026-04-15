# Tool functional matrix — 12 MCP tools

**Purpose:** Map each tool to **evidence** of success paths, validation failures, and HTTP error mapping.  
**Updated:** `2026-04-13`

Legend: **UT** = `npm test` (mock/unit), **Smoke** = `npm run smoke:api` (live, when credentials valid), **Pilot** = Claude Desktop manual UAT.

| Tool | Happy path | Bad input (Zod) | Empty list / zero hits | HTTP error mapping (401/404/429/…) | Primary evidence |
|------|------------|-----------------|-------------------------|-------------------------------------|------------------|
| `kontakt_kereses` | UT | UT | UT | UT | `crm-tools` tests + mock fixtures |
| `kontakt_lekeres` | UT | UT | UT (404 fixture) | UT | mock fixtures |
| `kontakt_letrehozas` | UT | UT | n/a | UT | mock write |
| `kontakt_modositas` | UT | UT | n/a | UT | mock write |
| `projekt_kereses` | UT + Smoke | UT | UT | UT | `03-project-list.json`, tests |
| `projekt_lekeres` | UT + Smoke | UT | UT | UT | `04-project-detail.json` |
| `projekt_letrehozas` | UT | UT | n/a | UT | mock |
| `projekt_statusz_valtas` | UT | UT | n/a | UT | body = `StatusId` only |
| `teendo_letrehozas` | UT | UT | n/a | UT | **PUT** live; POST 405 sample |
| `teendo_lekeres` | UT + Smoke | UT | UT | UT | `05-todolist.json` |
| `szamla_lekerdezes` | UT + Smoke | UT | UT | UT | `07-invoice-list.json` |
| `schema_lekerdezes` | UT + Smoke | UT | n/a | partial dual-request payload | Category + Schema; invalid CategoryId → schema error |

### Notes

- **Live pilot** cells: mark in `PILOT-EXECUTION-LOG.md` when stakeholders run UAT.
- **`schema_lekerdezes`**: “HTTP error mapping” includes the **custom** partial-failure JSON (`categoryHttp`, `schemaHttp`, `reszletek`) documented in `mcp-tool-contracts.md`.
