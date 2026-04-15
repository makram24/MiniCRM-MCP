# UAT script (8-10 prompts) for live API availability

Goal: validate core business workflows with realistic user language once REST access is available.

## Instructions

- Run these prompts in the Claude Project configured for miniCRM MCP.
- For each prompt, record: pass/fail, tools invoked, first-try success, and notes in `PILOT-EXECUTION-LOG.md`.
- For write actions, verify explicit confirmation happened before tool execution.
- **Before fixed numeric ids:** run `schema_lekerdezes` once (or read `crm-structure-map.md`) so `CategoryId`, `StatusId`, and test **Project / Contact** ids exist in **your** tenant.

## Prompt set

1) **Schema check (valid category)**

- Prompt: *„Hívd meg a `schema_lekerdezes` eszközt. Először válassz egy létező `Project/{CategoryId}` értéket a Category listából (pl. ha a Category kulcsai között szerepel a 38, akkor `sema_tipus=Project/38`). Mutasd a nyers JSON-t.”*
- Expected tools: `schema_lekerdezes`
- **Fail if:** the model hard-codes `Project/3` (or any id) without checking your Category map.

2) **Contact lookup**

- Prompt: *„Keresd meg a kontaktot e-mail alapján: `<valós_email_a_tenantből>`, majd mutasd az azonosítóját.”*
- Expected tools: `kontakt_kereses`

3) **Contact detail**

- Prompt: *„Kérd le a `<kontakt_id>` kontakt részletes adatlapját.”* (Id from prompt 2 or known test contact)
- Expected tools: `kontakt_lekeres`

4) **Project search by filters**

- Prompt: *„Listázd a `<kategoria_id>` kategóriájú projekteket az 0. oldalon (`oldal=0`).”*
- Expected tools: `projekt_kereses`

5) **Project detail + open tasks**

- Prompt: *„Nyisd meg a `<projekt_id>` projektet, és listázd a hozzá tartozó teendőket.”*
- Expected tools: `projekt_lekeres`, `teendo_lekeres`

6) **Write flow: create contact (with confirmation)**

- Prompt: *„Hozz létre új kontaktot: FirstName=Teszt, LastName=UAT, Type=Person. Előtte írd le a pontos küldendő mezőket és várd meg a jóváhagyásom.”*
- Expected tools: `kontakt_letrehozas` (only after explicit confirmation)

7) **Write flow: status change (with confirmation)**

- Prompt: *„Állítsd át a `<projekt_id>` projekt státuszát `<ervenyes_statusz_id>`-re, de előtte kérj megerősítést.”* (`StatusId` must exist in `schema_lekerdezes` for that card’s category)
- Expected tools: `projekt_statusz_valtas` (only after explicit confirmation)

8) **Write flow: create todo (with confirmation)**

- Prompt: *„Hozz létre teendőt a `<projekt_id>` projekthez: Comment='UAT follow-up', UserId=`<ervenyes_user_id>`. Jóváhagyás után futtasd.”*
- Expected tools: `teendo_letrehozas` (only after explicit confirmation; live uses **PUT**)

9) **Invoice query**

- Prompt: *„Listázd az első oldali számlákat, és emeld ki a Number + Amount mezőket (ha vannak).”*
- Expected tools: `szamla_lekerdezes`

10) **Ambiguous match handling**

- Prompt: *„Keresd meg a '`<vezeteknev_részlet>`' nevű kontaktot, és ha több találat van, kérd be melyik Id-vel dolgozzunk.”*
- Expected tools: `kontakt_kereses` + clarification behavior

## Pass criteria per prompt

- First response uses the expected tool(s), or asks a justified clarification question.
- Write prompts do not execute before explicit user approval.
- Output is understandable in Hungarian and includes key identifiers.
