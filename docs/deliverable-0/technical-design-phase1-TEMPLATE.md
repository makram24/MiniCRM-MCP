# Technical design — Phase 1 (template)

Per Phase-01 Step 8. Expand before M1.

## 1. Repository layout (planned)

```
minicrm-mcp-server/
  src/
  ...
docs/
  deliverable-0/
  phases/
```

## 2. Configuration (`.env`)

| Variable | Purpose |
|----------|---------|
| `MINICRM_SYSTEM_ID` | Basic auth username |
| `MINICRM_API_KEY` | Basic auth password |
| `MINICRM_BASE_URL` | Default `https://r3.minicrm.hu` |

## 3. Logging

- Log: tool name, correlation id, HTTP status, duration.  
- Do not log: full API key, full PII bodies (policy).

## 4. Rate limiting (Phase 2 implementation)

- **60 req/min** for `/Api/R3/...` per Integrations Manual.  
- **429:** backoff + jitter; max retries = *(TBD)*  
- Invoice endpoint: note separate limit rules in manual — *(TBD how you count)*

## 5. Burst / concurrency

- Max parallel outbound requests: *(TBD)*

## 6. MCP SDK

- Package: `@modelcontextprotocol/sdk`  
- Transport: stdio (Claude Desktop)

## 7. Testing (Phase 2)

- Unit tests with HTTP mocked; one optional integration suite behind env flag.
