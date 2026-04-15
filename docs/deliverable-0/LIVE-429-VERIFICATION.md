# Live 429 / rate-limit verification

**Policy:** R3 API documents **60 requests / minute**. The MCP server’s live backend applies throttling, concurrency limits, and **retry with backoff** on HTTP **429**.

## What is verified in automation

- **Unit tests** (`minicrm-mcp-server/src/minicrm/real-backend.test.ts`) simulate **429** responses and assert retry/success and exhausted-retry behaviour without hitting the real miniCRM production rate limiter.

## What is optional live

- A deliberate **live** load test to force **429** is **not required** for phase closure, because it can disrupt the shared tenant and is non-deterministic.
- If a stakeholder requires live proof, run a **short** burst from a non-production machine with agreement on timing, capture one **429** + retry success in `api-test-log.md`, and attach the log snippet (no secrets).

## Recommendation

Treat **automated 429 tests** + documented limit (60/min) as **M2 evidence** for backoff behaviour. Add a live row to `api-test-log.md` only if explicitly requested.
