# MCP tool contracts — 12 tools (Phase 1 baseline)

**Source of endpoint mapping:** `docs/Teszt-Projekt-MCP.md` → “Module mapping and tool map”.  
**Rule:** Fill **Inputs**, **Outputs**, and **Errors** only after real responses exist in `api-samples/` (Phase-01 Step 6). Do not invent field shapes.

**Scope:** No DELETE / purge tools.

---

## 1. `kontakt_kereses`

| | |
|--|--|
| **miniCRM** | `GET /Api/R3/Contact` |
| **Művelet (scope)** | Keresés — Name, Email, Phone, szűrés névvel, e-maillel, telefonnal |

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

### Inputs

*(TBD — Type = Business \| Person \| Project/{CategoryId} per manual)*

### Outputs

*(TBD — how combined result is returned to Claude)*

### Errors

*(TBD)*
