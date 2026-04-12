/**
 * miniCRM MCP server — stdio transport, 12 CRM eszköz (hatókör: docs/Teszt-Projekt-MCP.md).
 * MINICRM_USE_MOCK=true: fixture JSON-ek; egyébként Basic auth + HTTPS (rate limit 60/perc).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { loadMinicrmConfig, validateConfigForStartup } from "./config.js";
import { createMinicrmBackend } from "./minicrm/factory.js";
import { registerCrmTools } from "./register-crm-tools.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv 17+ logs "◇ injected env…" to stdout unless quiet — MCP stdio must be JSON-RPC only.
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const cfg = loadMinicrmConfig();
validateConfigForStartup(cfg);

const backend = createMinicrmBackend(cfg);

const mcpServer = new McpServer(
  {
    name: "minicrm-mcp",
    version: "0.2.0",
  },
  {
    instructions:
      "miniCRM MCP: 12 olvasó/író eszköz kontaktokra, projektekre, teendőkre, számlákra és sémára. " +
      (cfg.useMock
        ? "Jelenleg MOCK módban fut — a válaszok fixtúrák, nem élő CRM."
        : "Éles miniCRM REST API (Basic auth). Írási műveleteknél erősítsd meg a felhasználóval a tervet."),
  }
);

registerCrmTools(mcpServer, backend, { useMock: cfg.useMock });

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
