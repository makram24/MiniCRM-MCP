# API mapping pack (pre-live baseline)

Purpose: freeze the expected API wiring per tool before live REST access, so go-live is adapter verification, not redesign.

Error envelope baseline (live mode):
- `code` (string, short machine code)
- `httpStatus` (number)
- `messageHu` (string, user-facing)
- `technicalDetail` (optional, debug-only/truncated)

## Tool mapping table

| Tool | Method + endpoint | Required input | Expected success shape | Fallback when response differs |
|------|-------------------|----------------|------------------------|-------------------------------|
| `kontakt_kereses` | `GET /Api/R3/Contact` | At least one of: `Name`, `Email`, `Phone` | `Count`, `Results` | If list shape differs, normalize to `{ Count, Results }`; keep raw body under debug |
| `kontakt_lekeres` | `GET /Api/R3/Contact/{Id}` | `Id` | object with contact fields + `Id` | If 404-like payload, map to standardized not-found error |
| `kontakt_letrehozas` | `PUT /Api/R3/Contact` | `mezok` object | object with created `Id` | If API returns full object, still expose at least `Id` |
| `kontakt_modositas` | `PUT /Api/R3/Contact/{Id}` | `Id`, `mezok` | object with updated `Id` | If empty body on success, synthesize `{ Id }` |
| `projekt_kereses` | `GET /Api/R3/Project` | optional filters (`CategoryId`, `StatusId`, `ContactId`, `UserId`, `Name`, `Page`) | `Count`, `Results`, optional page info | If paging fields missing, keep `Count` + `Results` and append note |
| `projekt_lekeres` | `GET /Api/R3/Project/{Id}` | `Id` | object with project fields + `Id` | Map unknown field names without breaking core keys (`Id`, `StatusId`, `ContactId`) |
| `projekt_letrehozas` | `PUT /Api/R3/Project` | `mezok` object | object with created `Id` | If validation error payload differs, wrap into standardized error envelope |
| `projekt_statusz_valtas` | `PUT /Api/R3/Project/{Id}` | `Id`, `StatusId` only | object with `Id` | If API accepts extra fields, still send only `StatusId` from MCP |
| `teendo_letrehozas` | `POST /Api/R3/ToDo/` (verify live) | `ProjectId`, `UserId`, `Comment` (plus optional fields) | object with created `Id` | If POST fails and PUT works in tenant, toggle method only after evidence log |
| `teendo_lekeres` | `GET /Api/R3/ToDoList/{CardId}` | `CardId` | `Count`, `Results` list | If result key differs, normalize to list in `Results` |
| `szamla_lekerdezes` | `GET /Api/Invoice/List` (or `/Api/Invoice`) | optional filters (`ProjectId`, `ContactId`, `Page`, `UpdatedSince`, `StatusGroup`) | `Count`, `Results` | If endpoint differs, keep tool contract stable and remap adapter only |
| `schema_lekerdezes` | `GET /Api/R3/Category` + `GET /Api/R3/Schema/{Type}` | `Type` (`Business`, `Person`, `Project/{CategoryId}`) | `{ Category, Schema }` | If either call fails, return combined error with both statuses |

## Contract freeze notes

- Freeze date: `2026-04-13` (pre-live baseline).
- This file is the adapter map source for Phase 2 completion.
- Update with evidence references once real samples are saved in `docs/deliverable-0/api-samples/`.

## Runtime defaults (hardened baseline)

- Request timeout: `MINICRM_REQUEST_TIMEOUT_MS` (default `15000` ms).
- 429 retry attempts: `MINICRM_MAX_429_RETRIES` (default `3`), exponential backoff with jitter.
- Concurrency cap: `MINICRM_MAX_CONCURRENT` (default `4`).
- Log correlation: each tool invocation emits a `reqId` in structured stderr logs.
