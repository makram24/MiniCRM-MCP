# Phase acceptance criteria (M1/M2/M3)

Use this file as the formal "done" gate to avoid closing phases early.

## M1 - Discovery complete

Done when all are true:
- Real API access confirmed and baseline request returns 200.
- Required sample set is saved in `api-samples/` (category, schema, contact, project, todo, invoice).
- `mcp-tool-contracts.md` has no critical TBD sections for Inputs/Outputs/Errors.
- `api-test-log.md` and `api-discrepancies.md` are evidence-backed (not placeholders).
- Product owner sign-off captured.

Not done if any are true:
- ToDo create method/body is still unverified.
- Contracts rely only on fixtures.
- Missing sign-off artifact.

## M2 - MCP server implementation complete

Done when all are true:
- All 12 tools callable with stable schemas and expected endpoint mapping.
- Unit tests pass, including edge cases (bad input, empty results, mapped HTTP errors).
- Mock smoke run passes and live smoke subset passes when API available.
- Runtime hardening in place (env checks, timeout, retry/backoff, structured logs).
- Tool behavior matches frozen contracts or documented discrepancy decisions.

Not done if any are true:
- Tool behavior changed without contract update.
- 429/timeout behavior undefined.
- Known failures are only tracked verbally.

## M3 - Claude Desktop pilot complete

Done when all are true:
- Desktop integration is stable after restart, tools are visible and callable.
- Confirm-before-write and plan-then-execute behaviors are demonstrated.
- Pilot script (10-15 commands) executed with >=90% first-try success.
- Functional matrix per tool has success/failure evidence.
- Prompt + integration docs updated to final validated form.

Not done if any are true:
- Pilot success rate <90%.
- Approval safeguards are inconsistent.
- Results are not logged with reproducible evidence.
