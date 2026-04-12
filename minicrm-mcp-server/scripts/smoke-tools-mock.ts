/**
 * Exercise all 12 MCP tool → HTTP mappings against MockMinicrmBackend (no Claude, no network).
 *
 * Usage (from minicrm-mcp-server):
 *   npm run smoke:tools:mock
 */

import type { MinicrmBackend } from "../src/minicrm/types.js";

process.env.MINICRM_USE_MOCK = "true";

const { loadMinicrmConfig } = await import("../src/config.js");
const { createMinicrmBackend } = await import("../src/minicrm/factory.js");

type Case = {
  tool: string;
  label: string;
  run: (b: MinicrmBackend) => Promise<void>;
};

const cfg = loadMinicrmConfig();
const backend = createMinicrmBackend(cfg);

const cases: Case[] = [
  {
    tool: "kontakt_kereses",
    label: "GET Contact search",
    run: async (b) => {
      const r = await b.request({
        method: "GET",
        pathname: "/Api/R3/Contact",
        search: "Name=test",
      });
      assertOk(r, "contact search");
    },
  },
  {
    tool: "kontakt_lekeres",
    label: "GET Contact detail",
    run: async (b) => {
      const r = await b.request({
        method: "GET",
        pathname: "/Api/R3/Contact/37147",
      });
      assertOk(r, "contact detail");
    },
  },
  {
    tool: "kontakt_letrehozas",
    label: "PUT Contact create",
    run: async (b) => {
      const r = await b.request({
        method: "PUT",
        pathname: "/Api/R3/Contact",
        body: { FirstName: "T", LastName: "E", Type: "Person" },
      });
      assertOk(r, "contact create");
      assertJsonHasId(r);
    },
  },
  {
    tool: "kontakt_modositas",
    label: "PUT Contact update",
    run: async (b) => {
      const r = await b.request({
        method: "PUT",
        pathname: "/Api/R3/Contact/37147",
        body: { Email: "x@y.z" },
      });
      assertOk(r, "contact update");
    },
  },
  {
    tool: "projekt_kereses",
    label: "GET Project list",
    run: async (b) => {
      const r = await b.request({
        method: "GET",
        pathname: "/Api/R3/Project",
        search: "CategoryId=3&Page=0",
      });
      assertOk(r, "project list");
    },
  },
  {
    tool: "projekt_lekeres",
    label: "GET Project detail",
    run: async (b) => {
      const r = await b.request({
        method: "GET",
        pathname: "/Api/R3/Project/12345",
      });
      assertOk(r, "project detail");
    },
  },
  {
    tool: "projekt_letrehozas",
    label: "PUT Project create",
    run: async (b) => {
      const r = await b.request({
        method: "PUT",
        pathname: "/Api/R3/Project",
        body: { CategoryId: 3, ContactId: 1, Name: "Mock" },
      });
      assertOk(r, "project create");
      assertJsonHasId(r);
    },
  },
  {
    tool: "projekt_statusz_valtas",
    label: "PUT Project status only",
    run: async (b) => {
      const r = await b.request({
        method: "PUT",
        pathname: "/Api/R3/Project/999",
        body: { StatusId: 425 },
      });
      assertOk(r, "project status");
    },
  },
  {
    tool: "teendo_letrehozas",
    label: "POST ToDo create",
    run: async (b) => {
      const r = await b.request({
        method: "POST",
        pathname: "/Api/R3/ToDo/",
        body: {
          ProjectId: 1,
          UserId: 1,
          Comment: "smoke",
        },
      });
      assertOk(r, "todo create");
      assertJsonHasId(r);
    },
  },
  {
    tool: "teendo_lekeres",
    label: "GET ToDoList",
    run: async (b) => {
      const r = await b.request({
        method: "GET",
        pathname: "/Api/R3/ToDoList/12345",
      });
      assertOk(r, "todolist");
    },
  },
  {
    tool: "szamla_lekerdezes",
    label: "GET Invoice list",
    run: async (b) => {
      const r = await b.request({
        method: "GET",
        pathname: "/Api/Invoice/List",
        search: "Page=0",
      });
      assertOk(r, "invoice list");
    },
  },
  {
    tool: "schema_lekerdezes",
    label: "GET Category + Schema",
    run: async (b) => {
      const c = await b.request({ method: "GET", pathname: "/Api/R3/Category" });
      assertOk(c, "category");
      const s = await b.request({
        method: "GET",
        pathname: "/Api/R3/Schema/Project/3",
      });
      assertOk(s, "schema");
    },
  },
];

function assertOk(
  r: { status: number; bodyText: string },
  ctx: string
): void {
  if (r.status < 200 || r.status >= 300) {
    throw new Error(`${ctx}: HTTP ${r.status} — ${r.bodyText.slice(0, 200)}`);
  }
}

function assertJsonHasId(r: { bodyText: string }): void {
  const j = JSON.parse(r.bodyText) as { Id?: unknown };
  if (typeof j.Id === "undefined") {
    throw new Error(`expected { Id } in body, got: ${r.bodyText.slice(0, 120)}`);
  }
}

let failed = 0;
console.log("smoke-tools-mock: MockMinicrmBackend — 12 tool paths\n");

for (const c of cases) {
  try {
    await c.run(backend);
    console.log(`OK  ${c.tool.padEnd(22)} ${c.label}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${c.tool} — ${(e as Error).message}`);
  }
}

console.log("");
if (failed > 0) {
  console.error(`Done: ${failed} failed, ${cases.length - failed} passed`);
  process.exit(1);
}
console.log(`Done: ${cases.length} passed`);
