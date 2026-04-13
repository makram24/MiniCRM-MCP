# UAT script (8-10 prompts) for live API availability

Goal: validate core business workflows with realistic user language once REST access is available.

## Instructions

- Run these prompts in the Claude Project configured for miniCRM MCP.
- For each prompt, record: pass/fail, tools invoked, first-try success, and notes.
- For write actions, verify explicit confirmation happened before tool execution.

## Prompt set

1) **Schema check**
- Prompt: "Hívd meg a `schema_lekerdezes` eszközt `sema_tipus=Project/3` értékkel, és mutasd röviden a fő mezőket."
- Expected tools: `schema_lekerdezes`

2) **Contact lookup**
- Prompt: "Keresd meg a kontaktot e-mail alapján: `john.doe@example.com`, majd mutasd az azonosítóját."
- Expected tools: `kontakt_kereses`

3) **Contact detail**
- Prompt: "Kérd le a 37147-es kontakt részletes adatlapját."
- Expected tools: `kontakt_lekeres`

4) **Project search by filters**
- Prompt: "Listázd a 3-as kategóriájú, 0. oldali projekteket."
- Expected tools: `projekt_kereses`

5) **Project detail + open tasks**
- Prompt: "Nyisd meg a 160-as projektet, és listázd a hozzá tartozó teendőket."
- Expected tools: `projekt_lekeres`, `teendo_lekeres`

6) **Write flow: create contact (with confirmation)**
- Prompt: "Hozz létre új kontaktot: FirstName=Teszt, LastName=UAT, Type=Person. Előtte írd le a pontos küldendő mezőket és várd meg a jóváhagyásom."
- Expected tools: `kontakt_letrehozas` (only after explicit confirmation)

7) **Write flow: status change (with confirmation)**
- Prompt: "Állítsd át a 160-as projekt státuszát 2807-re, de előtte kérj megerősítést."
- Expected tools: `projekt_statusz_valtas` (only after explicit confirmation)

8) **Write flow: create todo (with confirmation)**
- Prompt: "Hozz létre teendőt a 160-as projekthez: Comment='UAT follow-up', UserId=3200. Jóváhagyás után futtasd."
- Expected tools: `teendo_letrehozas` (only after explicit confirmation)

9) **Invoice query**
- Prompt: "Listázd az első oldali számlákat, és emeld ki a Number + Amount mezőket."
- Expected tools: `szamla_lekerdezes`

10) **Ambiguous match handling**
- Prompt: "Keresd meg a 'Doe' nevű kontaktot, és ha több találat van, kérd be melyik Id-vel dolgozzunk."
- Expected tools: `kontakt_kereses` + clarification behavior

## Pass criteria per prompt

- First response uses the expected tool(s), or asks a justified clarification question.
- Write prompts do not execute before explicit user approval.
- Output is understandable in Hungarian and includes key identifiers.
