# CRM structure map

**Status:** *Pilot tenant snapshot + generic rules — `2026-04-13`.*  
**Source:** `GET /Api/R3/Category`, `GET /Api/R3/Schema/Project/{CategoryId}`, UI labels as returned by API.  
**Important:** Category and status ids **differ per miniCRM account**. Replace tables after kick-off if your tenant differs.

---

## Products / modules (CategoryId)

Snapshot from smoke **`01-category.json`** (pilot / engineering tenant — **redact or replace** for client deliverables):

| CategoryId | Module name (API / UI string) |
|------------|------------------------------|
| 23 | Értékesítés |
| 38 | Projektek |
| 5 | Ügyfélszolgálat |
| 9 | Számlázó |

**Rule for tools:** use `projekt_kereses.kategoria_id` and `schema_lekerdezes` with `Project/{CategoryId}` only for ids that appear in **your** Category map.

---

## Statuses per module

**Do not copy blindly across tenants.** Populate from `schema_lekerdezes` with `sema_tipus = "Project/{CategoryId}"` → `Schema.StatusId` map.

Example (**CategoryId = 38 — Projektek**) excerpt from live schema session (2026-04-13 pilot):

| StatusId | Status label |
|----------|----------------|
| 3012 | Marketing |
| 3013 | Befejezett |
| 3015 | Sikertelen |
| 3017 | Üzletfejlesztés |
| 3018 | Tervezés |
| 3053 | Projekt sablonok |
| 3054 | HR + Back Office |
| 3055 | Pénzügy |
| 3057 | Projektmenedzsment |

---

## Custom fields (registered names)

Admin UI registers fields; API JSON uses the **registered** names (e.g. `ProjectManagement_Deadline`).

### Project (category 38 — example)

| Registered name (API) | UI meaning (from schema labels / team) |
|-----------------------|----------------------------------------|
| `ProjectManagement_Type` | Szín / típus választó (enum ids → színek) |
| `ProjectManagement_DesiredOutcome` | Szöveges cél / kimenet |
| `ProjectManagement_Deadline` | Határidő |
| `ProjectManagement_ExpectedRevenue` | Várható bevétel |

Extend this table per **CategoryId** your pilot actually uses.

---

## Business vocabulary (Hungarian ↔ API)

| User / team says | Maps to |
|------------------|---------|
| „Értékesítési ügylet / deal” | `projekt_*` with `kategoria_id = 23` (this tenant) |
| „Projekt kártya” | `projekt_*` with `kategoria_id = 38` (this tenant) |
| „Számlák” | `szamla_lekerdezes` |
| „Feladat / teendő” | `teendo_*` (`card_id` ≈ projekt Id) |

---

## Maintenance

After any miniCRM admin change to modules, statuses, or fields: re-run `schema_lekerdezes` for each active `Project/{CategoryId}` and **update this file** + bump `mcp-tool-contracts.md` version if tool behaviour expectations change.
