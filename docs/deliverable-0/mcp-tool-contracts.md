# MCP tool contracts — 12 tools (frozen baseline)

**Source of endpoint mapping:** `docs/Teszt-Projekt-MCP.md` + `docs/deliverable-0/API-MAPPING-PACK.md`.  
**Evidence:** `docs/deliverable-0/api-samples/`, `api-test-log.md`, `api-discrepancies.md`.  
**Scope:** No DELETE / purge tools.

## Contract freeze metadata

- **Version:** `v1.0-live`
- **Freeze date:** `2026-04-13`
- **Unknown-field policy:** MCP Zod schemas accept only the documented top-level keys per tool. For writes, arbitrary miniCRM field names live under **`mezok`** (JSON object) and must match the REST API for that entity.
- **Standard live error envelope** (`execCrm` failures — `minicrm/errors.ts`):
  - `uzenetHu` — Hungarian summary
  - `httpStatus` — HTTP status number
  - `reszletek` — parsed JSON body when JSON; otherwise wrapper with `nyersValasz` text
- **Input validation error** (Zod `safeParse` failure): plain text starting with `Input validation error:` (not JSON).
- **Pagination:** Project / Contact search uses API `Page`; **first page = `0`** (second page = `1`, …).

---

## 1. `kontakt_kereses`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Contact` |
| **Scope** | Search contacts by name, email, or phone. |

### Inputs (MCP → maps to query string)

| MCP param | API query | Required |
|-----------|-----------|----------|
| `nev` | `Name` | no |
| `email` | `Email` | no |
| `telefon` | `Phone` | no |

At least one filter should be provided for useful results (not enforced by server — empty filters may return large sets).

### Outputs (success)

JSON object per miniCRM: typically **`Count`** (number), **`Results`** (object keyed by string Id → contact summary with `Id`, `Name`, `Url`, `Email`, `Phone`, `Type`, …). Optional note appended by MCP when list is empty (`Count === 0`).

### Errors

| HTTP | Meaning |
|------|---------|
| 400 / 401 / 403 / 404 / 429 / 5xx | Standard envelope (`uzenetHu`, `httpStatus`, `reszletek`). |

---

## 2. `kontakt_lekeres`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Contact/{Id}` |
| **Scope** | Full contact card by Id. |

### Inputs

| MCP param | Required | Notes |
|-----------|----------|-------|
| `kontakt_id` | yes | number or string; coerced to digits for path |

### Outputs (success)

JSON object: full contact fields (`FirstName`, `LastName`, `Email`, `Type`, custom keys, …) per tenant schema.

### Errors

404 if Id unknown; 401 auth; standard envelope otherwise.

---

## 3. `kontakt_letrehozas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Contact` |
| **Scope** | Create contact. **Write — confirm with user first.** |

### Inputs

| MCP param | Required | Notes |
|-----------|----------|-------|
| `mezok` | yes | JSON object sent as request body (e.g. `FirstName`, `LastName`, `Email`, `Phone`, `Type`: `Person` / `Business`, …) |

### Outputs (success)

Typically `{ "Id": <newId> }` (miniCRM convention).

### Errors

400 validation; 401; 500 on bad payload; standard envelope.

---

## 4. `kontakt_modositas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Contact/{Id}` |
| **Scope** | Partial/full update. **Write — confirm.** |

### Inputs

| MCP param | Required |
|-----------|----------|
| `kontakt_id` | yes |
| `mezok` | yes — only fields to change |

### Outputs (success)

Often `{ "Id": <id> }` or echo of saved record per API.

### Errors

404; 400; standard envelope.

---

## 5. `projekt_kereses`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Project` |
| **Scope** | Search projects/deals. |

### Inputs

| MCP param | API query | Required |
|-----------|-----------|----------|
| `kategoria_id` | `CategoryId` | no |
| `statusz_id` | `StatusId` | no |
| `kontakt_id` | `ContactId` | no |
| `felhasznalo_id` | `UserId` | no |
| `nev` | `Name` | no |
| `oldal` | `Page` | no (default API behaviour if omitted) |

### Outputs (success)

`Count`, `Results` (object keyed by Id). **Note:** In list responses `StatusId` / `UserId` are often **numeric**; in **detail** (`projekt_lekeres`) the same logical fields may appear as **human-readable strings** — see `api-discrepancies.md`.

### Errors

Standard HTTP envelope.

---

## 6. `projekt_lekeres`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Project/{Id}` |
| **Scope** | Single project detail. |

### Inputs

| MCP param | Required |
|-----------|----------|
| `projekt_id` | yes |

### Outputs (success)

Full project JSON (includes `CategoryId`, `ContactId`, `StatusId` as labels or numbers per tenant, custom fields).

### Errors

404; standard envelope.

---

## 7. `projekt_letrehozas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Project` |
| **Scope** | Create project. **Write — confirm.** |

### Inputs

| MCP param | Required | Notes |
|-----------|----------|-------|
| `mezok` | yes | Must include at least **`CategoryId`** and **`ContactId`** for new cards (miniCRM rule); optional `Name`, `StatusId`, custom fields per schema |

### Outputs (success)

Typically `{ "Id": <newId> }`.

### Errors

400 missing mandatory fields; standard envelope.

---

## 8. `projekt_statusz_valtas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Project/{Id}` |
| **Scope** | **Status change only** — request body is **`{ "StatusId": … }`** alone. **Write — confirm.** |

### Inputs

| MCP param | Required | Notes |
|-----------|----------|-------|
| `projekt_id` | yes | |
| `statusz_id` | yes | Sent as `StatusId` in JSON; numeric strings coerced to number when safe (`normalizeStatusIdForBody`) |

### Outputs (success)

Often `{ "Id": <id> }`.

### Errors

400/404/500; standard envelope.

---

## 9. `teendo_letrehozas`

| | |
|--|--|
| **miniCRM** | **`PUT /Api/R3/ToDo/`** |
| **Scope** | Create todo on a card. **Write — confirm.** |

### Tenant note (verified 2026-04-13)

**POST** to `/Api/R3/ToDo/` → **405**. **PUT** to `/Api/R3/ToDo/` is the working method for this tenant. Samples: `api-samples/08-todo-probe-*.json`.

### Inputs

| MCP param | Required |
|-----------|----------|
| `mezok` | yes | e.g. `ProjectId`, `UserId`, `Deadline`, `Type`, `Comment` — exact required fields depend on module/schema |

### Outputs (success)

New Id or confirmation JSON per API.

### Errors

400 on invalid/empty body; 405 if method wrong; standard envelope.

---

## 10. `teendo_lekeres`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/ToDoList/{CardId}` |
| **Scope** | Todos for a project/card. |

### Inputs

| MCP param | Required | Notes |
|-----------|----------|-------|
| `card_id` | yes | Usually **project Id** |

### Outputs (success)

`Count` and `Results` (array or object per API version — see samples `05-todolist.json`).

### Errors

404/401; standard envelope.

---

## 11. `szamla_lekerdezes`

| | |
|--|--|
| **miniCRM** | `GET /Api/Invoice/List` |
| **Scope** | Issued invoices list. |

### Inputs

| MCP param | API query | Required |
|-----------|-----------|----------|
| `projekt_id` | `ProjectId` | no |
| `kontakt_id` | `ContactId` | no |
| `oldal` | `Page` | no |
| `frissitve` | `UpdatedSince` | no |
| `status_csoport` | `StatusGroup` | no |

### Outputs (success)

`Count`, `Results` (may be empty array — still **200**). Sample: `07-invoice-list.json`.

### Errors

Standard envelope.

---

## 12. `schema_lekerdezes`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Category` then `GET /Api/R3/Schema/{Type}` |
| **Scope** | Categories map + schema for one type path. |

### Inputs

| MCP param | Required | Notes |
|-----------|----------|-------|
| `sema_tipus` | yes | Path segment **after** `/Api/R3/Schema/` — e.g. `Business`, `Person`, **`Project/{CategoryId}`**. **`CategoryId` must exist in your tenant** (from `Category` keys). Docs often show `Project/3` as an example; **your** ids come from `GET /Api/R3/Category` (e.g. `23`, `38`, …). |

### Outputs (success)

Single JSON object:

```json
{
  "Category": { "<id>": "<module name>", "..." : "..." },
  "Schema": { "<field>": "<type or enum map>", "...": "..." }
}
```

Prefix **`[Mock] `** when `MINICRM_USE_MOCK=true`.

### Errors (partial success)

Unlike other tools, **one call performs two HTTP requests**. If either fails, MCP returns **`isError: true`** with a structured payload:

**Live mode:**

- `uzenetHu` — Hungarian summary (which leg failed)
- `categoryHttp` — status of Category request
- `schemaHttp` — status of Schema request
- `reszletek` — `{ Category: <body>, Schema: <body> }` (parsed JSON or fallback)

**Mock mode:** `categoryStatus`, `schemaStatus`, `Category`, `Schema`.

Common user mistake: **`Project/3`** when `3` is not a category → often **schema 500** with plain-text `Schema.nyersValasz` explaining unknown product code — use a real **`CategoryId`** from the `Category` object.

---

## Change control

After `v1.0-live`, any behaviour or field contract change should update this file **and** `api-discrepancies.md` (if tenant/manual drift), then bump version (`v1.1-…`).
