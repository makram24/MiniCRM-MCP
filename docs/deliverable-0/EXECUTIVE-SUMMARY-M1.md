# Executive summary — Deliverable 0 (M1)

**Date:** `2026-04-13`  
**Scope:** miniCRM REST (R3 + Invoice list) via MCP — **12 tools**, **no delete**.

## What we proved

- Live **Basic auth** works against `https://r3.minicrm.hu` for Category, Schema, Project, Contact, ToDo list, Invoice list (`api-samples/`, `npm run smoke:api`).
- **ToDo create** on the pilot tenant: **PUT** `/Api/R3/ToDo/` is correct; **POST** returns **405** (documented in `api-discrepancies.md`).
- **CategoryId** values are **tenant-specific**; documentation examples such as **`Project/3`** may fail with HTTP **500** on schema — operators must use ids from **`schema_lekerdezes`** / Category response.

## Main risks / constraints

- **401** if API key rotated or `.env` / Desktop `env` mismatch; REST add-on + plan required per miniCRM help.
- **Rate limit** 60 req/min (R3); server implements 429 retry/backoff (unit-tested; live flood test optional).
- **List vs detail** shape differences for some fields (`StatusId` / `UserId` types) — see `api-discrepancies.md`.

## Open (process)

- Formal **product owner sign-off** on frozen contracts (`PHASE-SIGNOFF-EVIDENCE-TEMPLATE.md`).
- **M3 pilot log** completion with ≥90% first-try success where required by phase gate.

## Where to read more

- Contracts: `mcp-tool-contracts.md` (**v1.0-live**)
- Desktop: `CLAUDE-DESKTOP-SETUP.md`
- Pilot prompts: `UAT-SCRIPT-8-10-PROMPTS.md`
