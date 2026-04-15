# API test log

**Status:** *Élő füstteszt + minták — 2026-04-13.*  
**Bodies:** `api-samples/` (megosztás előtt PII redakció).

| # | Date | Method | URL (path + query) | HTTP | Sample file | Notes |
|---|------|--------|---------------------|------|-------------|-------|
| 1 | 2026-04-13 | GET | /Api/R3/Category | 200 | `01-category.json` | Smoke (`npm run smoke:api`, `SMOKE_SAVE=1`) |
| 2 | 2026-04-13 | GET | /Api/R3/Schema/Project/23 | 200 | `02-schema-project.json` | Első numerikus CategoryId a category válaszból (`23`) |
| 3 | 2026-04-13 | GET | /Api/R3/Project?CategoryId=23&Page=0 | 200 | `03-project-list.json` | |
| 4 | 2026-04-13 | GET | /Api/R3/Project/10 | 200 | `04-project-detail.json` | Lista vs részlet: `api-discrepancies.md` |
| 5 | 2026-04-13 | GET | /Api/R3/ToDoList/10 | 200 | `05-todolist.json` | CardId = projekt Id a listából |
| 6 | 2026-04-13 | GET | /Api/R3/Contact?Name=a | 200 | `06-contact-search-name.json` | |
| 7 | 2026-04-13 | GET | /Api/R3/Contact/67 | 200 | `09-contact-detail.json` | Id a keresés első találatából (fájlnév történeti: `09-`) |
| 8 | 2026-04-13 | GET | /Api/Invoice/List | 200 | `07-invoice-list.json` | `Count:0`, `Results:[]` — üres lista, de 200 |
| 9 | 2026-04-13 | POST | /Api/R3/ToDo/ | 405 | `08-todo-probe-post.json` | Nem engedélyezett — üres `{}` probe (opcionális: `SMOKE_PROBE_TODO=1`) |
| 10 | 2026-04-13 | PUT | /Api/R3/ToDo/ | 400 | `08-todo-probe-put.json` | Metódus elfogadva; üres body → validációs hiba (várt) |
| 11 | 2026-04-13 | (simulated) | HTTP wrapper — **429** retry | n/a | `minicrm-mcp-server/src/minicrm/real-backend.test.ts` | Élő 429 kényszerítés opcionális; lásd `LIVE-429-VERIFICATION.md` |

---

## ToDo create verification (Phase-01 Step 4.8)

| Working method | Path | Request body shape (summary) | Sample file |
|----------------|------|------------------------------|-------------|
| **PUT** | `/Api/R3/ToDo/` | JSON mezők (pl. ProjectId, UserId, Comment) — pontos séma: manual + sikeres írás teszt később | `08-todo-probe-put.json` (hiba szöveg üres `{}`-ra); **POST → 405:** `08-todo-probe-post.json` |

**MCP:** `teendo_letrehozas` a kódban **PUT** (2026-04-13).
