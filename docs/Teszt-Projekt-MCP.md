# Makram — Scope of Work Document

**miniCRM Single-User MCP**  
Local Claude Desktop MCP server for individual miniCRM users.

| Reference | DEMO |
|-----------|------|
| Author | Makram |
| Date | 8 April 2026 |

---

## Makram — DEMO — TEST PROJECT

### Executive summary

A local MCP server built between Claude Desktop and the miniCRM REST API, providing natural-language Hungarian CRM control for individual users.

The miniCRM built-in AI agent works from templates. It does not understand free-form natural-language commands and cannot write data to the database. At the end of a session it resets: there is no memory, no context. This project addresses that by building a locally running MCP server (Model Context Protocol: open standard for connecting AI models and external systems). Claude Desktop reads and writes via the miniCRM REST API on a server running on the client’s own machine, without involving an external provider.

**Platform context**

The miniCRM Professional subscription includes the REST API add-on (Basic Auth: SystemId + API key, 60 requests/minute, JSON/UTF-8). The client separately pays for Claude Pro or Team, which includes the Claude Desktop application. The MCP server is built in Node.js, runs locally on the client’s computer, and connects through the Claude Desktop MCP configuration.

**Scope boundary:** This project is for individual, single-person use. It does not include team-level rollout, user management, miniCRM platform changes, frontend development, or Zapier integration. Delete operations are intentionally not implemented for data security.

**74%**

74% of CRM users reported that after introducing AI tools their administrative workload decreased noticeably, freeing time for real value-creating work. Source: McKinsey & Company, The State of AI in 2023 (n = 1,684 companies). Type: external industry benchmark.

### Project objectives

**Claude Desktop as a natural-language CRM interface**

The client pays for both miniCRM Professional and Claude Pro/Team. Until now the two systems did not communicate. This project changes that. The MCP server exposes 12 CRM tools to Claude Desktop: contacts, projects, tasks, invoices. The three intelligent behaviour layers (approval-based execution, plan communication, persistent memory) are not new code development. They are system-prompt engineering work, built on Claude’s native capabilities. The client writes to Claude in Hungarian, and the CRM executes.

---

## Platform integration

| Component | Current state | What this project changes | Data flow | Prerequisites |
|-----------|---------------|---------------------------|-----------|---------------|
| Claude Desktop | General-purpose AI assistant, no CRM access | Extended with MCP configuration: knows and uses the 12 CRM tools | Client → Claude Desktop → MCP server → miniCRM REST API | Claude Desktop installed; MCP configuration access |
| MCP server | Does not exist | New local Node.js server, 12 CRM tools, REST API calls | Claude Desktop ↔ MCP server (localhost) ↔ miniCRM REST API | Node.js on client machine; miniCRM API access |
| miniCRM REST API | Active, Professional subscription and REST API add-on | Unchanged; MCP server reads/writes via Basic Auth | MCP server → HTTPS → miniCRM API (60 req/min) | SystemId + API key (REST API add-on); Professional package |
| Existing AI Agent | Template-based, 15-minute cycle, no write permission, no memory | Unchanged; MCP server operates on the Claude Desktop side; does not affect the AI Agent | The AI Agent remains in miniCRM in parallel | None; the two systems are independent of each other |
| System prompt (Claude Projects) | Does not exist | New, embedded CRM structure, business logic, module names, loaded automatically every session | Claude Projects → system prompt → Claude Desktop context | Claude Pro or Team subscription (Projects feature) |

---

## Module mapping and tool map

The table below maps miniCRM REST API modules to the MCP server’s 12 tools, showing the endpoint, operation, and key fields.

| miniCRM API module | API endpoint | MCP tool | Operation | Key fields |
|--------------------|--------------|----------|-----------|------------|
| Contacts | GET /Api/R3/Contact | kontakt_kereses | Search | Name, Email, Phone, filtering by name, email, phone |
| Contacts | GET /Api/R3/Contact/{Id} | kontakt_lekeres | Read | Id → full record: name, email, phone, company, custom fields |
| Contacts | PUT /Api/R3/Contact | kontakt_letrehozas | Create | FirstName, LastName, Email, Phone, Type |
| Contacts | PUT /Api/R3/Contact/{Id} | kontakt_modositas | Update | Id + any contact field updates |
| Projects | GET /Api/R3/Project | projekt_kereses | Search | CategoryId, StatusId, ContactId, UserId, Name |
| Projects | GET /Api/R3/Project/{Id} | projekt_lekeres | Read | Id → full project/deal: status, owner, contact, history |
| Projects | PUT /Api/R3/Project | projekt_letrehozas | Create | CategoryId, ContactId, Name, custom fields |
| Projects | PUT /Api/R3/Project/{Id} | projekt_statusz_valtas | Status change | Id + StatusId, status change only, does not modify other fields |
| ToDo | POST /Api/R3/ToDo/ | teendo_letrehozas | Create | ProjectId, UserId, Deadline, Type, Comment |
| ToDo | GET /Api/R3/ToDoList/{CardId} | teendo_lekeres | Read | CardId → task list: type, deadline, status, owner |
| Invoices | GET /Api/Invoice | szamla_lekerdezes | Read | ProjectId, ContactId → invoices: amount, status, due date |
| Schema | GET /Api/R3/Category, GET /Api/R3/Schema/{Type} | schema_lekerdezes | Read | Available modules, project categories, statuses, list of custom fields |

**Note on delete operations**

Delete endpoints (DELETE) are intentionally not implemented in any module. This is not a technical limitation but a deliberate decision for data security: a misunderstood natural-language command must not cause irreversible data loss. Instead of delete, use status change (`projekt_statusz_valtas`) or field clearing (`kontakt_modositas`).

---

## Example use cases

| Natural-language command | MCP tools involved | Notes |
|--------------------------|-------------------|--------|
| “Check all clients I haven’t contacted in 30 days, and for each create a follow-up task for next week.” | projekt_kereses, projekt_lekeres, teendo_letrehozas | Plan-then-execute: Claude first shows the list, then after approval creates all tasks |
| “Show all open offers with total value, who is responsible, and when they expire.” | projekt_kereses, projekt_lekeres | Aggregated report across multiple projects |
| “For every unpaid invoice older than 15 days, create an ‘Invoice reminder’ task for the responsible sales rep.” | szamla_lekerdezes, projekt_lekeres, teendo_letrehozas | Cross-module operation; plan-then-execute mode |
| “Change all projects in ‘Offer sent’ status that have no open tasks to ‘Waiting’ status.” | projekt_kereses, teendo_lekeres, projekt_statusz_valtas | Conditional bulk status change; Claude asks for approval row by row |
| “Create a new contact: Gábor Szabó, gabor.szabo@cegnev.hu, then assign to project XY as responsible contact.” | kontakt_letrehozas, projekt_kereses, projekt_statusz_valtas | Two-step creation + assignment; approval-based execution |
| “I want a summary of projects created last week and their open tasks.” | projekt_kereses, projekt_lekeres, teendo_lekeres | Synthesised weekly report with date filtering |
| “Search for ‘Kovács’; if there are multiple matches show all of them, then I’ll say which one to update.” | kontakt_kereses, kontakt_modositas | Ambiguous name handling: Claude asks back when multiple contacts match |
| “What project categories and statuses are available in my system?” | schema_lekerdezes | Schema query; useful for system prompt and status logic maintenance |

---

## Expected business impact

| Area | Current state | Expected improvement | Notes | Source type |
|------|---------------|----------------------|-------|-------------|
| Command execution speed | Manual clicking, search, filling forms, minutes | Natural-language command: seconds | Estimated 5–10 minutes saved per CRM action | Estimate |
| Data quality | Incomplete entry, forgotten updates | Faster capture → fewer gaps | Approval layer prevents typos | Internal target metric |
| AI capabilities | Template-based, no write permission, no memory | Free natural language, write permission, persistent memory | Claude native capabilities available immediately | Project parameter |
| User experience | Waiting, navigation, multiple clicks | Single Hungarian sentence command, immediate result | Goal: noticeably lower cognitive load per session | Internal target metric |
| Data security | — | Data does not leave the client machine | Local server, no intermediary third party | Project parameter |
| TCO (total cost of ownership) | miniCRM Professional + REST API add-on + Claude Pro/Team | No new subscriptions; existing tools leveraged | One-off development investment, minimal ongoing cost | Estimate |
| Extensibility | Built-in AI Agent not extensible | MCP server extendable with new tools; system prompt freely customisable | Optional add-ons increase system capability | Project parameter |

---

## Detailed project scope

The project consists of 5 sequential phases within one week. Approach: discovery → development → integration and pilot → validation → handover.

### Phase 1: Discovery and schema mapping

- Understanding the structure of the client’s miniCRM account: active modules, statuses, custom fields, categories  
- Testing REST API endpoints with the real API key: contact, project, task, invoice endpoints  
- Defining exact input/output schemas for the 12 MCP tools based on real API responses  
- Documenting the client’s business logic: how they name modules, what status flows they use, what commands they typically expect  
- Producing a technical development plan: tool structure, error-handling logic, rate-limit handling  
- Creating Node.js project baseline, MCP SDK setup  

**Out of scope in this phase:**

**Decision point**  
At the end of the phase Makram presents the mapped CRM structure, API endpoint test results, and planned schemas for the 12 MCP tools. Makram confirms every endpoint and the API key work. If there is deviation or a blocker, the schedule and scope are decided jointly.

•  
•  
•  
•  
•  
•  
- Actual implementation of MCP tools ✕  
- Claude Desktop integration ✕  
- System prompt development ✕  

### Phase 2: MCP server development and implementation of 12 tools

- MCP server foundation: server framework, authentication, logging, error handling  
- Contacts group (4 tools): kontakt_kereses, kontakt_lekeres, kontakt_letrehozas, kontakt_modositas — full CRUD without delete  
- Projects group (4 tools): projekt_kereses, projekt_lekeres, projekt_letrehozas, projekt_statusz_valtas — status change as a separate tool  
- ToDo group (2 tools): teendo_letrehozas, teendo_lekeres — task management tied to projects  
- Invoices + Schema (2 tools): szamla_lekerdezes, schema_lekerdezes — read-only  
- Unit tests for every tool: success response, bad parameter handling, empty result handling  
- Rate-limit implementation (60 req/min limit, burst protection)  
- Local testing in development environment with the client’s API key  

**Out of scope in this phase:**

### Phase 3: Claude Desktop integration, system prompt, and pilot

- Wiring the MCP server into Claude Desktop configuration (`claude_desktop_config.json`)  
- Implementing the 3 intelligent behaviour layers via system-prompt engineering:  
  - **Confirm-before-execute:** before write operations Claude states what it will do and asks for approval; if multiple contacts match, it asks back  
  - **Plan-then-execute:** for complex multi-step requests (e.g. bulk task creation) Claude first shows a step plan, then executes only after approval  
  - **Persistent memory:** CRM structure, module names, business logic embedded in Claude Projects system prompt, loaded automatically every session  
- First pilot test on real data: executing 10–15 natural-language commands on the client’s live CRM data  
- Functional testing: documenting success/failure cases for every tool  
- Prompt tuning based on pilot feedback  

**Out of scope in this phase:**

**Decision point**  
At the end of the pilot the results are reviewed together. Goal: at least 90% of the 10–15 executed commands work; both approval layers run. If needed, the prompt is iterated here. Any scope-change needs are recorded here.

•  
•  
•  
•  
•  
•  
•  
•  
- Claude Desktop integration (Phase 3) ✕  
- Delete operations (intentionally omitted) ✕  
- System prompt development ✕  
•  
•  
•  
•  
•  
•  
•  
•  
- Validation test (Phase 4) ✕  
- Team-level rollout ✕  

### Phase 4: Validation and tuning

- Checking acceptance criteria: measuring success rate per tool  
- Testing edge cases: ambiguous names (multiple matching contacts), empty fields, hitting rate limit, bad parameters  
- Validating clarification logic: when 2 or more contacts match, Claude actually asks back  
- Testing approval flow: for every write operation confirm-before-execute runs  
- Checking Hungarian response quality: Claude answers consistently in Hungarian  
- Bug fixes and prompt iteration based on test results  
- Performance measurement: average response time, number of API calls per complex command  

**Out of scope in this phase:**

### Phase 5: Handover and self-service installation handover

- Demo with the client: demonstrating full system operation on real miniCRM data  
- Deliverables: MCP server source code, configuration, installation guide  
- Post-handover support available by phone and email  

**Out of scope**

•  
•  
•  
•  
•  
•  
•  
- Developing new tools based on needs arising during testing ✕  
- Team-level testing ✕  
•  
•  
•  
- **Team-level rollout:** The system is tied to one Claude account and one miniCRM access; team rollout is not part of the project ✕
- **miniCRM platform changes:** No changes to the miniCRM web UI, codebase, or configuration ✕  
- **Frontend development:** No new UI is built; Claude Desktop is the only interface ✕  
- **Zapier or other automation platforms:** No Zapier, Make, n8n, or other external trigger-based solution ✕  
- **Ongoing maintenance:** Operations and updates after handover are available as an optional package ✕  
- **Data migration:** No data migration; the system reads existing miniCRM data ✕  
- **Cloud hosting:** The MCP server runs only locally; no cloud deploy, no server rental ✕  
- **Data not available in miniCRM API:** Whatever the REST API does not return cannot be retrieved by the MCP server ✕  

---

## Approach and methodology

**Approach**

The project closes within one week. Short feedback with the client at the end of every phase. Continuously, phase by phase.

**Local development and handover model**

MCP server development and testing take place in Makram’s own environment using the client’s miniCRM API key. The client’s machine is not involved during development. Handover is a demo plus step-by-step installation guide; the client installs on their own machine.

**Required access**

- miniCRM SystemId and API key (REST API add-on): the only credential the MCP server needs to talk to miniCRM  
- Claude Pro or Team: prerequisite for Claude Desktop and Projects; a separate Anthropic API key is not required — inference is included in the subscription  
- Node.js: required on the client machine to run the MCP server; installation is part of the handover guide  

**Communication**

- Written status report each phase: completed work, next phase plan, any questions  
- Available by phone and email for the full project duration  
- Demo with client at pilot close  
- Demo at handover  

**Testing**

- Unit tests for every MCP tool (locally, dev environment)  
- Functional tests on real miniCRM data in the pilot phase  
- Acceptance criteria checked in the validation phase (≥ 90% successful command rate)  

**Importance of individual user context**

Every miniCRM account is structured differently: different module names, statuses, custom fields. The discovery phase is therefore mandatory: implementation starts only after the real structure is known. The goal is for the system to follow the client’s own CRM logic, not a generic template.

---

## Milestones and schedule

| Milestone | Phase | Deliverable | Acceptance condition |
|-----------|-------|-------------|----------------------|
| M1: Schema mapping complete | End of Phase 1 | API tests documented, tool schemas defined, business logic recorded | Client approves documented structure |
| M2: 12 tools implemented | End of Phase 2 | Working MCP server locally, all 12 tools unit-tested | Every tool returns correct results on test data |
| M3: Claude Desktop pilot run | End of Phase 3 | Claude Desktop connected, system prompt set, 10–15 pilot commands executed | ≥ 90% of pilot commands succeed on first try |
| M4: Validation complete | End of Phase 4 | Acceptance criteria met, bugs fixed, feedback incorporated | Every acceptance criterion satisfied |
| M5: Handover complete | End of Phase 5 | Source and configuration handed over, demo done, installation guide delivered | Client approves handover based on demo |

---

## Deliverables and acceptance criteria

| # | Deliverable | Description | Acceptance criterion |
|---|-------------|-------------|------------------------|
| 0 | Schema discovery document | Client CRM structure: active modules, statuses, custom fields, API endpoint test results, input/output schemas for 12 tools | Client approves at end of discovery (decision point) |
| 1 | MCP server source | Node.js-based, 12 CRM tools, commented code, README | Every tool works per agreed specification |
| 2 | Claude Desktop configuration | `claude_desktop_config.json` setup and documentation | Claude Desktop successfully sees and uses all 12 tools |
| 3 | System prompt | CRM structure, business logic, behaviour rules configured in Claude Projects | Loads every session automatically; confirm-before-execute and plan-then-execute work |
| 4 | Installation guide | Step-by-step: Node.js install, server files, `.env` setup, `claude_desktop_config.json` | Client successfully installs on their machine using the guide |
| 5 | Command examples and troubleshooting | 15–20 real command examples tailored to client CRM; common errors and fixes | Reviewed and accepted by client |
| 6 | Handover minutes | Project summary, list of delivered items, signatures | Signed by both parties |

---

## Quality target metrics

| Metric | Target | Measurement method |
|--------|--------|-------------------|
| Successful command rate | ≥ 90% (first try) | Pilot and validation test log |
| Clarification accuracy | 100%: if ≥ 2 matching contacts, always asks back | Manual testing with ambiguous cases |
| Approval-based execution | 100%: confirm appears before every write | Manual testing on every write tool |
| Average response time | < 15 seconds (simple query), < 30 seconds (complex multi-step) | Manual measurement during pilot |
| Hungarian responses | ≥ 95%, Claude answers consistently in Hungarian | Pilot and validation evaluation |
| Handover documentation completeness | Min. 15 command examples, 5 troubleshooting cases, step-by-step install guide | Documentation table of contents check |

---

## Optional add-ons

| # | Add-on | Description |
|---|--------|-------------|
| 1 | Monthly maintenance and support | Ongoing help: API changes, prompt tuning, bug fixes, answering questions |
| 2 | Team-level rollout | Extending MCP server to multiple Claude accounts and miniCRM users, with access control |
| 3 | Extra MCP tools | Beyond the 12 base tools: e.g. email history, template management, document upload handling |
| 4 | Deeper system-prompt training | Client learns to customise system prompt: new rules, business logic updates, expanding command examples |
| 5 | Cloud MCP server | Moving MCP server to cloud hosting (e.g. Railway, Fly.io), access independent of a single machine |

---

## Assumptions and prerequisites

| # | Assumption / prerequisite | Responsible party |
|---|---------------------------|-------------------|
| 1 | miniCRM Professional + REST API add-on: client has active Professional subscription and REST API add-on | Client |
| 2 | Claude Pro or Team: client has active Claude Pro or Team (for Projects) | Client |
| 3 | SystemId and API key: client provides SystemId and API key for miniCRM REST API | Client |
| 4 | Claude Desktop installed on client computer | Client |
| 5 | Node.js on client machine: MCP server requires Node.js runtime; installation is part of handed-over guide | Client |
| 6 | Availability for feedback: client can allocate short time each phase for feedback and approval | Client |
| 7 | REST API available and stable: miniCRM REST API is available during the project and works per documentation | miniCRM platform |

---

## Identified risks and mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | REST API endpoint mismatch: real responses differ from documentation (missing fields, different structure) | Medium | Medium | Discovery phase identifies; tool schemas built on real responses |
| 2 | Rate limit reached: complex multi-step commands generate traffic above 60 req/min | Low | Medium | Rate-limit layer; break complex commands; cache where possible |
| 3 | Data security: incorrect storage of API key | Low | High | Secrets in `.env` file, not in source; data-handling guidance in manual |
| 4 | Claude Hungarian coherence: Claude sometimes switches to English if tools return English | Medium | Low | Strict Hungarian instructions in system prompt; tool responses structured with Hungarian keywords |
| 5 | Misunderstood command: Claude calls wrong tool or wrong parameters | Medium | Medium | Confirm-before-execute; client sees what will happen before approval |
| 6 | miniCRM API change: miniCRM updates API, changes endpoints | Low | High | Optional long-term maintenance package; MCP source is handed over and can be modified |
| 7 | Client Claude Desktop version: different versions have different MCP support | Low | Medium | Version check in discovery; update recommended if needed |

---

## Next steps

This document is a project proposal. The following steps are required to start the project.

1. **Review and approval of this document** — The client reviews and approves the scope statement and scope.  
2. **Contracting** — Contract signing and formal project start.  
3. **Provision of access** — Send miniCRM SystemId and API key; this is the only credential needed for development.  
4. **Kick-off and project start** — Kick-off meeting, then immediate start of Phase 1.

For questions, please contact:

**Makram**  
Portfolio project — miniCRM MCP server  

---

*Scope document for the Makram miniCRM Single-User MCP portfolio project. Identifiers (tool names, file names, JSON keys) match the implementation.*
