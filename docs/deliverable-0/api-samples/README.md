# API samples

Save successful JSON responses here during Phase 1 (redact PII if sharing).

**Smoke runner:** from `minicrm-mcp-server/` run:

```bash
# Windows PowerShell
$env:SMOKE_SAVE="1"; npm run smoke:api
```

If you see **401** on every call, Basic auth failed: check **SystemId** (5-digit tenant id from the browser URL) and **API key** (Settings → System; admin-generated). The Integrations Manual also notes **404** can mean access denied in some cases.
