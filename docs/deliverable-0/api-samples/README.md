# API samples

Save successful JSON responses here during Phase 1 (redact PII if sharing).

## Smoke runner

From `minicrm-mcp-server/`:

```powershell
$env:SMOKE_SAVE="1"; npm run smoke:api
```

ToDo **POST vs PUT** probe (Phase-01 Step 4.8): üres `{}` törzs, nem hoz létre rekordot; a válasz fájlokba menthetők:

```powershell
$env:SMOKE_SAVE="1"; $env:SMOKE_PROBE_TODO="1"; npm run smoke:api
```

Optional (prints base URL, **lengths** of id/key, and response headers — **no secrets**):

```powershell
$env:DEBUG_SMOKE="1"; npm run smoke:api
```

Files are written **only** when the response status is **2xx**.

---

## If every call returns **401** (your case)

`401 Unauthorized` means miniCRM did **not** accept **HTTP Basic** credentials:

- **Username** = **SystemId** (the number in the URL right after the host when you are logged in, e.g. `https://r3.minicrm.hu/87697/...` → `87697`).
- **Password** = **REST API key** (Settings → System → API key; only an **admin** can create it — it is **not** your login password).

Checklist (see `docs/MiniCRM-Integrations-Manual.md` — Basics + API key generation):

1. **SystemId** is copied from the **browser address bar** while logged in (Integrations Manual: “How to find the SystemID?”), not guessed.
2. **API key** is the **REST** key from System settings, still valid (if unsure, **generate a new key** and update `.env` once — old integrations using the old key must be updated).
3. **No extra characters** in `.env`: no quotes unless needed, no spaces around `=`, no trailing spaces on the key line (the script trims; if you use a BOM-only file, re-save as UTF-8).
4. **Subscription**: **Professional** (or plan that includes REST) + **REST API add-on** active. Wrong plan can show as auth/forbidden-style errors in some setups.
5. **Host**: `MINICRM_BASE_URL` must match where you actually use miniCRM (default `https://r3.minicrm.hu`). If your company uses another host, set it explicitly.

**Verify outside Node** (replace placeholders, do not commit):

```powershell
curl.exe -s -o NUL -w "%{http_code}" --user "YOUR_SYSTEM_ID:YOUR_API_KEY" "https://r3.minicrm.hu/Api/R3/Category"
```

You want **200**. If this is **401** too, the issue is credentials or host — not the smoke script.

**Note:** The Integrations Manual also describes **404** with text like access denied for wrong credentials or plan; your server returns **401**, which still means “not authenticated” for this check.
