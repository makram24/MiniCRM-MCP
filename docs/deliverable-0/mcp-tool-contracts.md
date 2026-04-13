# MCP tool contracts — 12 tools (Phase 1 baseline)

**Source of endpoint mapping:** `docs/Teszt-Projekt-MCP.md` → “Module mapping and tool map”.  
**Rule:** Fill **Inputs**, **Outputs**, and **Errors** only after real responses exist in `api-samples/` (Phase-01 Step 6). Do not invent field shapes.

**Scope:** No DELETE / purge tools.

## Contract freeze metadata (pre-live)

- Contract baseline version: `v0.9-prelive`
- Freeze date: `2026-04-13`
- Unknown-field policy: tool schemas accept only defined top-level arguments; custom write payload remains under `mezok`.
- Standardized live error envelope:
  - `code` (machine-friendly string)
  - `httpStatus` (number)
  - `messageHu` (human-readable Hungarian message)
  - `technicalDetail` (optional; debug/truncated)

Update this metadata to `v1.0` after real API samples are attached for every tool family.

---

## 1. `kontakt_kereses`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Contact` |
| **Művelet (scope)** | Keresés — Name, Email, Phone, szűrés névvel, e-maillel, telefonnal |

### Felhasználó felé / MCP leírás (HU)

Kontaktok keresése név, e-mail vagy telefon alapján; több találat esetén az asszisztens felsorolja az azonosítókat.

### Inputs

*(TBD — list query params from manual + live tests)*

### Outputs

*(TBD — shape of `Count` / `Results` / pagination)*

### Errors

*(TBD — map HTTP codes to Hungarian messages)*

---

## 2. `kontakt_lekeres`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Contact/{Id}` |
| **Művelet (scope)** | Olvasás — Id → teljes adatlap |

### Felhasználó felé / MCP leírás (HU)

Egy kontakt teljes adatlapjának lekérése azonosító alapján (név, elérhetőségek, egyedi mezők).

### Inputs

*(TBD)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 3. `kontakt_letrehozas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Contact` |
| **Művelet (scope)** | Létrehozás — FirstName, LastName, Email, Phone, Type |

### Felhasználó felé / MCP leírás (HU)

Új személy vagy cég kontakt létrehozása a megadott mezőkkel; írási művelet — előtte erősítsd meg a felhasználóval.

### Inputs

*(TBD)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 4. `kontakt_modositas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Contact/{Id}` |
| **Művelet (scope)** | Módosítás — Id + bármely kontaktmező |

### Felhasználó felé / MCP leírás (HU)

Meglévő kontakt mezőinek frissítése; írási művelet — egyértelmű azonosító (Id) szükséges.

### Inputs

*(TBD)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 5. `projekt_kereses`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Project` |
| **Művelet (scope)** | Keresés — CategoryId, StatusId, ContactId, UserId, Name |

### Felhasználó felé / MCP leírás (HU)

Projektek és ügyletek keresése szűrőkkel (modul/kategória, státusz, kapcsolódó kontakt, tulajdonos, név).

### Inputs

*(TBD)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 6. `projekt_lekeres`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Project/{Id}` |
| **Művelet (scope)** | Olvasás — Id → teljes projekt/ügylet |

### Felhasználó felé / MCP leírás (HU)

Egy projekt vagy ügylet részletes adatai: státusz, tulajdonos, kontakt, előzmények, egyedi mezők.

### Inputs

*(TBD)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 7. `projekt_letrehozas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Project` |
| **Művelet (scope)** | Létrehozás — CategoryId, ContactId, Name, egyedi mezők |

### Felhasználó felé / MCP leírás (HU)

Új projekt vagy ügylet létrehozása; kötelező mezők a fiók szabályaitól függnek — írási művelet.

### Inputs

*(TBD — required fields depend on module/status per manual)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 8. `projekt_statusz_valtas`

| | |
|--|--|
| **miniCRM** | `PUT /Api/R3/Project/{Id}` |
| **Művelet (scope)** | Státuszváltás — **Id + StatusId only**; más mezőt nem módosít |

### Felhasználó felé / MCP leírás (HU)

Csak a projekt státuszát állítod át; más mező nem változik — írási művelet, jóváhagyással.

### Inputs

*(TBD — enforce StatusId-only body in Phase 2)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 9. `teendo_letrehozas`

| | |
|--|--|
| **miniCRM** | `POST /Api/R3/ToDo/` *(verify live — manual inconsistent)* |
| **Művelet (scope)** | Létrehozás — ProjectId, UserId, Deadline, Type, Comment |

### Felhasználó felé / MCP leírás (HU)

Teendő (feladat) létrehozása egy projekthez kötve; írási művelet. Az élő HTTP metódust Phase-01 Step 4.8 rögzíti.

### Inputs

*(TBD after Step 4.8 verification)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 10. `teendo_lekeres`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/ToDoList/{CardId}` |
| **Művelet (scope)** | Olvasás — CardId → teendőlista |

### Felhasználó felé / MCP leírás (HU)

Egy kártyához (általában projekt Id) tartozó teendők listája: határidő, státusz, felelős.

### Inputs

*(TBD)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 11. `szamla_lekerdezes`

| | |
|--|--|
| **miniCRM** | `GET /Api/Invoice` |
| **Művelet (scope)** | Olvasás — ProjectId, ContactId → számlák |

### Felhasználó felé / MCP leírás (HU)

Kibocsátott számlák listája szűrőkkel (pl. projekt, kontakt, lapozás). A listázó végpont részleteit az Integrations Manual és az élő API egyezteti (`api-discrepancies.md`).

### Inputs

*(TBD — align with Integrations Manual Invoice chapter + live)*

### Outputs

*(TBD)*

### Errors

*(TBD)*

---

## 12. `schema_lekerdezes`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Category` **és** `GET /Api/R3/Schema/{Type}` |
| **Művelet (scope)** | Olvasás — modulok, kategóriák, státuszok, egyedi mezők |

### Felhasználó felé / MCP leírás (HU)

Elérhető modulok (kategóriák) és egy választott típushoz tartozó meződefiníciók / enumerációk lekérése — rendszer- és prompt-karbantartáshoz.

### Inputs

*(TBD — Type = Business \| Person \| Project/{CategoryId} per manual)*

### Outputs

*(TBD — how combined result is returned to Claude)*

### Errors

*(TBD)*
