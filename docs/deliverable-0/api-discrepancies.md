# API discrepancies vs manual

**Status:** *Track B1 — keret; táblázat kitöltése `api-samples/` és Phase-01 Step 5 után.*  
**Reference:** `docs/MiniCRM-Integrations-Manual.md`

Összehasonlítás: élő válaszok vs manual példák. Minden sorhoz jegyezd meg, melyik MCP eszközt érinti.

| # | Endpoint / area | Manual says | Live behaviour | Impact on tools |
|---|-----------------|-------------|----------------|-----------------|
| — | *példa: ToDo create* | POST `/Api/R3/ToDo/` (scope); manualban ellentmondás | *TBD élő teszt után* | `teendo_letrehozas` |
| | | | | |
| | *Invoice list* | `GET /Api/Invoice/List` (manual listázás) | *TBD* | `szamla_lekerdezes` (implementáció: List endpoint) |
| | | | | |
