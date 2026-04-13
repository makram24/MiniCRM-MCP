# Live smoke subset (run when REST API is available)

Purpose: fast confidence pass after wiring live credentials, before full UAT.

## Preconditions

- `.env` set to live mode (`MINICRM_USE_MOCK=false`).
- Valid `MINICRM_SYSTEM_ID` and `MINICRM_API_KEY`.
- `npm run build` completed.

## Read-only checks (safe first)

1. `GET /Api/R3/Category`
- Expect: HTTP 200 and JSON body.

2. Contact search
- Path: `GET /Api/R3/Contact?Name=test`
- Expect: HTTP 200, parseable JSON (`Count` and `Results`-like payload).

3. Project list
- Path: `GET /Api/R3/Project?Page=0`
- Expect: HTTP 200, list payload.

4. ToDo list
- Path: `GET /Api/R3/ToDoList/{knownProjectId}`
- Expect: HTTP 200 (or documented 404 if missing card id).

5. Invoice list
- Path: `GET /Api/Invoice/List?Page=0`
- Expect: HTTP 200 (or documented tenant-specific discrepancy).

## Optional write checks (explicit approval required)

6. Contact create (`kontakt_letrehozas`)
- Expect: success with created `Id`, or validation error mapped to HU message.

7. Project status change (`projekt_statusz_valtas`)
- Expect: status update accepted with `StatusId`-only body behavior intact.

8. ToDo create (`teendo_letrehozas`)
- Expect: verified working method (POST or PUT) captured in evidence docs.

## Evidence to capture

- Add each run to `api-test-log.md` (method, URL, status, sample file name).
- Save representative response JSON into `api-samples/`.
- Record mismatches in `api-discrepancies.md`.
