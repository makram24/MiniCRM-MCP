# Pilot execution log — Claude Desktop + miniCRM MCP

**Script:** `UAT-SCRIPT-8-10-PROMPTS.md` (+ optional `PILOT-SCENARIOS-CHECKLIST.md`).  
**Pass rule (M3):** ≥ **90%** first-try success; writes must show **confirmation before** tool execution.

Fill **Date**, **Operator**, **Result** as you run. Evidence can be screenshots or pasted JSON snippets (redact PII).

---

## Session metadata

| Field | Value |
|-------|-------|
| Date | |
| Operator | |
| Claude Desktop version | |
| MCP mode | `mock` / `live` |
| `minicrm-mcp-server` commit / tag | |
| Approver (PO) for M3 closeout | |

---

## Prompt results (10)

| # | Prompt (short) | First-try pass? | Tools used | Confirm-before-write OK? | Notes |
|---|----------------|-----------------|------------|---------------------------|-------|
| 1 | Schema (`schema_lekerdezes` real `Project/{CategoryId}`) | | `schema_lekerdezes` | n/a | Use Id from your Category list |
| 2 | Contact by email | | `kontakt_kereses` | n/a | Replace example email |
| 3 | Contact detail by Id | | `kontakt_lekeres` | n/a | Use Id from search |
| 4 | Project list `kategoria_id` + `oldal` | | `projekt_kereses` | n/a | |
| 5 | Project detail + todos | | `projekt_lekeres`, `teendo_lekeres` | n/a | Replace project Id |
| 6 | Create contact (confirm) | | `kontakt_letrehozas` | must be YES | |
| 7 | Status change (confirm) | | `projekt_statusz_valtas` | must be YES | Use valid `StatusId` from schema |
| 8 | Create todo (confirm) | | `teendo_letrehozas` | must be YES | Live uses **PUT** |
| 9 | Invoice list | | `szamla_lekerdezes` | n/a | |
| 10 | Ambiguous name handling | | `kontakt_kereses` + clarify | n/a | |

**First-try pass rate:** ___ / 10 = ___ %

---

## Engineering dry-run (2026-04-13)

The following were observed in development / screenshots (not a substitute for formal PO pilot row above):

| # | Result | Notes |
|---|--------|-------|
| 1 | Pass | `schema_lekerdezes` with valid tenant CategoryId (e.g. `Project/38`, `Project/23`) |
| 4 | Pass | `projekt_kereses` `kategoria_id=23`, `oldal=0` |
| 9 | Pass | `szamla_lekerdezes` empty list still 200 |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Pilot operator | | | |
| Product owner | | | |
