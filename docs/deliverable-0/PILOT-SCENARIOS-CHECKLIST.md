# Pilot scenarios — checklist (Phase 3 prep)

**Source:** `docs/Teszt-Projekt-MCP.md` → “Example use cases” + Phase-03 Step 7 (10–15 commands on **live** data).  
**B3 use:** Tick boxes during the pilot; add rows for extra commands you design with the client.

**Note:** These are **Hungarian-style** intents; exact wording will vary. Mock mode can rehearse **read-heavy** flows; **writes** need stakeholder approval on live (Phase-03 P3.9–P3.10).

---

## From scope (8 reference scenarios)

| # | Scenario (intent) | Tools (from scope) | Pilot pass? | Notes |
|---|-------------------|--------------------|-------------|-------|
| 1 | Clients not contacted in 30 days → follow-up task next week each | projekt_kereses, projekt_lekeres, teendo_letrehozas | [ ] | Plan-then-execute |
| 2 | Open offers: value, owner, expiry summary | projekt_kereses, projekt_lekeres | [ ] | Aggregate report |
| 3 | Unpaid invoices >15 days → “Invoice reminder” task for rep | szamla_lekerdezes, projekt_lekeres, teendo_letrehozas | [ ] | Cross-module; plan first |
| 4 | Projects in “Offer sent” with no open tasks → move to “Waiting” | projekt_kereses, teendo_lekeres, projekt_statusz_valtas | [ ] | Approve row-by-row if needed |
| 5 | New contact + tie to project XY as responsible | kontakt_letrehozas, projekt_kereses, projekt_statusz_valtas | [ ] | Two-step + approval |
| 6 | Summary: projects created last week + open tasks | projekt_kereses, projekt_lekeres, teendo_lekeres | [ ] | Date filters |
| 7 | Search “Kovács” → multiple matches → user picks Id → update | kontakt_kereses, kontakt_modositas | [ ] | Ambiguity handling |
| 8 | What categories and statuses exist? | schema_lekerdezes | [ ] | Read-only; good first live test |

---

## Add-on slots (reach 10–15 with the client)

| # | Command (HU or EN intent) | Tools used | Pilot pass? | Notes |
|---|---------------------------|------------|-------------|-------|
| 9 | *TBD* | | [ ] | |
| 10 | *TBD* | | [ ] | |
| 11 | *TBD* | | [ ] | |
| 12 | *TBD* | | [ ] | |
| 13 | *TBD* | | [ ] | |
| 14 | *TBD* | | [ ] | |
| 15 | *TBD* | | [ ] | |

---

## Gate M3 reminder (Phase-03)

Target: **≥90%** pilot commands succeed on **first try**; **confirm-before-execute** and **plan-then-execute** both **demonstrated** at least once.

---

## Optional log columns

When you run the pilot, copy rows into a spreadsheet or `pilot-log.md`: **#**, **user text**, **pass/fail**, **tools called**, **stderr / API notes** (no secrets).
