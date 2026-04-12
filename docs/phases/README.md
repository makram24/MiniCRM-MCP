# Phase runbooks (miniCRM Single-User MCP)

Detailed **step-by-step** guides for each scope phase. Execute **in order**. These files **do not replace** `Teszt-Projekt-MCP.md`, `MiniCRM-Integrations-Manual.md`, or `Teszt-Projekt-MCP-Implementation-Plan.md`.

| Order | File | Milestone |
|-------|------|-----------|
| 1 | [Phase-01-Discovery-and-Schema-Mapping.md](./Phase-01-Discovery-and-Schema-Mapping.md) | M1 |
| 2 | [Phase-02-MCP-Server-and-Twelve-Tools.md](./Phase-02-MCP-Server-and-Twelve-Tools.md) | M2 |
| 3 | [Phase-03-Claude-Desktop-Integration-and-Pilot.md](./Phase-03-Claude-Desktop-Integration-and-Pilot.md) | M3 |
| 4 | [Phase-04-Validation-and-Tuning.md](./Phase-04-Validation-and-Tuning.md) | M4 |
| 5 | [Phase-05-Handover.md](./Phase-05-Handover.md) | M5 |

---

## Verification checklist (double-check against PDF + live systems)

Use this list **before** you treat the markdown docs as authoritative for implementation, contracts, or legal scope. Check off items as you verify them.

### Documentation fidelity

- [ ] **`MiniCRM-Integrations-Manual.md`** — Spot-check critical sections (auth, limits, Contact/Project/ToDo/Invoice) against the **original PDF**; extraction can mis-format tables or miss image-only content.
- [ ] **`Teszt-Projekt-MCP.md`** — For contractual or exact wording, compare to the **Hungarian `Teszt_Projekt_MCP.pdf`** (English file is a translation, not a verbatim copy).
- [ ] **Confusing ✕ rows in the scope PDF** — If a table row contradicts the phase text (e.g. items marked out of scope next to in-scope work), resolve using the **PDF** and stakeholder intent, not the MD alone.

### miniCRM REST API (live tenant)

- [ ] **ToDo create** — Confirm HTTP method and body for `POST`/`PUT` to `/Api/R3/ToDo/` on **your** system (Integrations Manual examples disagree).
- [ ] **PurgePerson / delete paths** — Confirm method/path if you ever reference them internally; scope **forbids** delete tools, but docs should stay accurate.
- [ ] **Invoice API** — Confirm query parameters and behaviour for `GET /Api/Invoice` (and list endpoints) against **live** responses; manual notes different rate limits for Invoice vs `/Api/R3`.
- [ ] **Pagination** — Confirm `Page` (0-based) and **100** results per page for your list endpoints.
- [ ] **Auth errors** — Confirm how your tenant returns **401/403 vs 404** (manual overloads some codes); map them in the MCP server after real tests.
- [ ] **Required fields** — Project/contact create/update required fields depend on **module + status**; verify in UI + Schema API for **your** CRM, not only from examples in the manual.

### Claude Desktop / MCP (Anthropic)

- [ ] **`claude_desktop_config.json`** — Schema, keys, and **config file location** match **current** Anthropic documentation for your OS.
- [ ] **MCP transport** — stdio server expectations match the **current** Claude Desktop version you ship against.
- [ ] **`@modelcontextprotocol/sdk` (or chosen SDK)** — Package name and APIs match **current** published SDK / docs.

### Engineering assumptions in runbooks

- [ ] **Rate limiter design** (token bucket vs sliding window, Invoice vs R3 counting) — Aligned with your load tests and miniCRM behaviour.
- [ ] **Base URL** — Default `https://r3.minicrm.hu` is correct for the tenant (or override per environment).

### Sign-off

- [ ] Stakeholder accepts that **PDF + live API** override markdown where they differ.

