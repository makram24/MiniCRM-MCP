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
| 1 | Schema (`schema_lekerdezes` real `Project/{CategoryId}`) | YES | `schema_lekerdezes` | n/a | First try success: Category list queried, valid `38` selected, `Project/38` schema returned (screenshot + pasted response). |
| 2 | Contact by email | YES | `kontakt_kereses` | n/a | First try success in latest rerun: contact found by email with `ID=103` (`Type=Person`). Earlier run in this session had 0 hits before contact creation. |
| 3 | Contact detail by Id | YES | `kontakt_lekeres` | n/a | First try success: retrieved full details for contact `103` (name, email, timestamps, deleted flag, optional fields). |
| 4 | Project list `kategoria_id` + `oldal` | YES | `projekt_kereses` | n/a | First try success: listed page 0 for category 38 with 7 projects and expected summary table fields. |
| 5 | Project detail + todos | YES | `projekt_lekeres`, `teendo_lekeres` | n/a | First try success: returned project `171` details and linked todo list (1 item, `ID=630`, comment `UAT follow-up`). |
| 6 | Create contact (confirm) | YES | `kontakt_letrehozas`, `schema_lekerdezes`, `kontakt_letrehozas` | YES | Confirmed before write. Initial `Type=2` attempt was rejected by API, assistant adapted to `Type=\"Person\"` and creation succeeded with `Id=103`. |
| 7 | Status change (confirm) | YES | `projekt_statusz_valtas` | YES | First try success: assistant requested confirmation, then updated project `171` status to `3053` successfully. |
| 8 | Create todo (confirm) | YES | `teendo_letrehozas` | YES | First try success: explicit confirmation requested, then todo created (`Teendő ID=630`) for `ProjectId=171`, `UserId=166762`, comment `UAT follow-up`. |
| 9 | Invoice list | YES | `szamla_lekerdezes` | n/a | First try success: queried first page, correctly reported 0 invoices, and offered useful next filters (`StatusGroup`, project/contact scope). |
| 10 | Ambiguous name handling | YES | `kontakt_kereses` + clarify | n/a | First try success: returned 3 matches and asked user to choose the working ID before proceeding. |

**First-try pass rate:** 10 / 10 = 100% *(complete)*

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
