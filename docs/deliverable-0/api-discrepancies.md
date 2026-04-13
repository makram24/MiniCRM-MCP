# API discrepancies vs manual

**Status:** *Track B1 — keret; táblázat kitöltése `api-samples/` és Phase-01 Step 5 után.*  
**Reference:** `docs/MiniCRM-Integrations-Manual.md`

Összehasonlítás: élő válaszok vs manual példák. Minden sorhoz jegyezd meg, melyik MCP eszközt érinti.

| # | Endpoint / area | Manual says | Live behaviour | Impact on tools |
|---|-----------------|-------------|----------------|-----------------|
| 1 | ToDo create method | POST `/Api/R3/ToDo/` (scope); manualban lehet eltérés | **TBD élő teszt** - ha tenantban PUT működik, adapterben csak a metódus vált | `teendo_letrehozas` |
| | | | | |
| 2 | Invoice list endpoint | `GET /Api/Invoice/List` (manual listázás) | **TBD élő teszt** - fallback: `/Api/Invoice` olvasás támogatott mockban | `szamla_lekerdezes` |
| | | | | |
| 3 | Error payload shape | Manual példák vegyes mezőneveket mutatnak | **Pre-live baseline:** egységes MCP hiba burkoló (`code/httpStatus/messageHu/technicalDetail`) | összes író/olvasó tool |
| | | | | |
