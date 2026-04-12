/**
 * Phase 1 API smoke tests — reads ../.env (or minicrm-mcp-server/.env when run from repo root).
 * Does not print secrets. Saves JSON bodies under docs/deliverable-0/api-samples/ when SMOKE_SAVE=1.
 *
 * Usage (from minicrm-mcp-server):
 *   node scripts/smoke-api.mjs
 *   set SMOKE_SAVE=1 && node scripts/smoke-api.mjs   (Windows PowerShell: $env:SMOKE_SAVE=1)
 *
 * Debug (no secrets printed):
 *   $env:DEBUG_SMOKE="1"; npm run smoke:api
 */

import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPathCandidates = [
  path.join(root, ".env"),
  path.join(process.cwd(), ".env"),
];

function loadEnv(filePath) {
  let txt = fs.readFileSync(filePath, "utf8");
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function resolveEnvPath() {
  for (const p of envPathCandidates) {
    if (fs.existsSync(p)) return p;
  }
  console.error("Missing .env. Tried:", envPathCandidates.join(", "));
  process.exit(1);
}

function httpsGet(urlString, systemId, apiKey) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlString);
    const auth = Buffer.from(`${systemId}:${apiKey}`, "utf8").toString("base64");
    const opts = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    };
    https
      .get(opts, (res) => {
        const headers = { ...res.headers };
        let data = "";
        res.on("data", (c) => {
          data += c;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode ?? 0, body: data, headers });
        });
      })
      .on("error", reject);
  });
}

function firstCategoryId(categoryJson) {
  try {
    const o = JSON.parse(categoryJson);
    const keys = Object.keys(o).filter((k) => /^\d+$/.test(k));
    return keys.length ? keys[0] : null;
  } catch {
    return null;
  }
}

function saveSample(name, body, status) {
  if (process.env.SMOKE_SAVE !== "1") return;
  if (status < 200 || status >= 300) return;
  const outDir = path.resolve(root, "..", "docs", "deliverable-0", "api-samples");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${name}.json`);
  fs.writeFileSync(file, body, "utf8");
  console.error("saved:", path.relative(process.cwd(), file));
}

async function main() {
  const envPath = resolveEnvPath();
  const env = loadEnv(envPath);
  const systemId = env.MINICRM_SYSTEM_ID;
  const apiKey = env.MINICRM_API_KEY;
  const base = (env.MINICRM_BASE_URL || "https://r3.minicrm.hu").replace(/\/$/, "");

  if (!systemId || !apiKey) {
    console.error("MINICRM_SYSTEM_ID and MINICRM_API_KEY required in .env");
    process.exit(1);
  }

  if (process.env.DEBUG_SMOKE === "1") {
    console.error(
      "[debug] MINICRM_BASE_URL=",
      base,
      "| systemId char length=",
      String(systemId).length,
      "| apiKey char length=",
      String(apiKey).length,
      "(no values printed)"
    );
  }

  const results = [];

  async function run(name, url) {
    const { status, body, headers } = await httpsGet(url, systemId, apiKey);
    results.push({ name, url: url.replace(apiKey, "***"), status, bytes: body.length });
    if (process.env.DEBUG_SMOKE === "1") {
      const w = headers["www-authenticate"];
      const ct = headers["content-type"];
      if (w) console.error("[debug]", name, "www-authenticate:", w);
      if (ct) console.error("[debug]", name, "content-type:", ct);
    }
    saveSample(name, body, status);
    let preview = body.slice(0, 200).replace(/\s+/g, " ");
    if (body.length > 200) preview += "…";
    if (status < 200 || status >= 300) {
      console.log(`${status}\t${name}\t${preview || "(empty body)"}`);
    } else {
      console.log(`${status}\t${name}\t${preview}`);
    }
    return { status, body };
  }

  console.log("status\tname\tbody_preview (truncated)\n");

  const rCat = await run("01-category", `${base}/Api/R3/Category`);
  const catId = firstCategoryId(rCat.body);

  if (catId) {
    await run("02-schema-project", `${base}/Api/R3/Schema/Project/${catId}`);
    const rProj = await run("03-project-list", `${base}/Api/R3/Project?CategoryId=${catId}&Page=0`);
    let projectId = null;
    try {
      const pj = JSON.parse(rProj.body);
      const resultsObj = pj.Results || {};
      const firstKey = Object.keys(resultsObj)[0];
      if (firstKey && resultsObj[firstKey]?.Id != null) {
        projectId = String(resultsObj[firstKey].Id);
      }
    } catch {
      /* ignore */
    }
    if (projectId) {
      await run("04-project-detail", `${base}/Api/R3/Project/${projectId}`);
      await run("05-todolist", `${base}/Api/R3/ToDoList/${projectId}`);
    } else {
      console.log("(skip 04–05: no project Id parsed from list)");
    }
  } else {
    console.log("(skip 02–05: could not parse CategoryId from Category response)");
  }

  await run("06-contact-search-name", `${base}/Api/R3/Contact?Name=a`);

  await run("07-invoice-list", `${base}/Api/Invoice/List`);

  console.log("\n--- summary ---");
  for (const r of results) {
    console.log(`${r.status}\t${r.name}`);
  }

  const failed = results.filter((r) => r.status < 200 || r.status >= 300);
  if (failed.length) {
    console.error("\nNon-2xx responses:", failed.map((f) => f.name).join(", "));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
