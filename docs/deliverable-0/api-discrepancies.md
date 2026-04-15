# API discrepancies vs manual

**Status:** *Élő minták alapján frissítve — 2026-04-13.*  
**Reference:** `docs/MiniCRM-Integrations-Manual.md`

Összehasonlítás: élő válaszok vs manual példák. Minden sorhoz jegyezd meg, melyik MCP eszközt érinti.

| # | Endpoint / area | Manual says | Live behaviour | Impact on tools |
|---|-----------------|-------------|----------------|-----------------|
| 1 | ToDo create method | Gyakran **POST** `/Api/R3/ToDo/` | **PUT** `/Api/R3/ToDo/` — **POST → 405** (probe: `08-todo-probe-post.json`); **PUT** üres `{}` → **400** (probe: `08-todo-probe-put.json`) | `teendo_letrehozas` — implementáció **PUT** |
| 2 | Invoice list endpoint | `GET /Api/Invoice/List` | **200** működik; üres lista: `Count:0`, `Results:[]` (`07-invoice-list.json`) | `szamla_lekerdezes` — OK |
| 3 | Error payload shape | Manual példák vegyes mezőneveket mutatnak | **Pre-live baseline:** egységes MCP hiba burkoló (`uzenetHu` / `httpStatus` élőben; mock: `status` + `body`) | összes író/olvasó tool |
| 4 | Project list vs detail | Gyakran ugyanaz a mezőtípus | **Lista:** `StatusId` **szám** (pl. 2519), `UserId` **szám**. **Részlet:** `StatusId` **szöveg** (státusz név), `UserId` **szöveg** (felhasználó név) — lásd `03-project-list.json` vs `04-project-detail.json` | `projekt_kereses`, `projekt_lekeres` — UI/prompt: ne feltételezd, hogy mindig szám |
| 5 | Contact write `Type` value | Sémában enum-id (pl. `2 = Személy`) alapján numerikus érték is várhatónak tűnhet | Élő írásnál `Type=2` elutasítva; `Type=\"Person\"` működik (pilot evidence) | `kontakt_letrehozas`, `kontakt_modositas` — szerver oldali normalizálás: `2→Person`, `1→Business` |
