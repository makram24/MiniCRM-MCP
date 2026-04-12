/**
 * Phase 1 stub — per docs/phases/Phase-01-Discovery-and-Schema-Mapping.md
 *
 * - Proves Node + @modelcontextprotocol/sdk + stdio MCP transport.
 * - Does NOT register the 12 miniCRM tools (that is Phase 2 per Teszt-Projekt-MCP.md).
 *
 * IMPORTANT: Do not write to stdout except via the MCP transport (JSON-RPC).
 * Use console.error only for fatal startup errors.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const mcpServer = new McpServer(
  {
    name: "minicrm-mcp",
    version: "0.1.0-phase1-stub",
  },
  {
    instructions:
      "Fázis 1: ez egy üres MCP szerver (még nincsenek miniCRM eszközök). " +
      "A 12 CRM eszköz a Phase 2-ben kerül implementálásra a hatókör szerint.",
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
