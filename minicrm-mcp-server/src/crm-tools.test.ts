import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import {
  CRM_TOOL_NAMES,
  type CrmToolName,
  invokeCrmTool,
} from "./crm-tools.js";
import { MockMinicrmBackend } from "./minicrm/mock-backend.js";
import type { MinicrmRequest, MinicrmResponse } from "./minicrm/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "../fixtures");

function textOf(r: CallToolResult): string {
  const c = r.content?.[0];
  if (c?.type === "text" && typeof c.text === "string") return c.text;
  return "";
}

function assertValidationError(r: CallToolResult): void {
  assert.equal(r.isError, true);
  assert.ok(textOf(r).includes("Input validation error"));
}

function assertHttpError(r: CallToolResult, useMock: boolean): void {
  assert.equal(r.isError, true);
  const t = textOf(r);
  if (useMock) {
    assert.ok(
      t.includes('"status"') ||
        t.includes("categoryStatus") ||
        t.includes("schemaStatus")
    );
  } else {
    assert.ok(t.includes("uzenetHu") || t.includes("httpStatus"));
  }
}

function assertSuccessWithMockPrefix(r: CallToolResult): void {
  assert.ok(!r.isError);
  assert.ok(textOf(r).startsWith("[Mock]"));
}

function parseJsonTail(text: string): unknown {
  const i = text.indexOf("{");
  if (i < 0) throw new Error("no JSON object in text");
  const j = text.lastIndexOf("}");
  if (j < i) throw new Error("no closing brace for JSON object");
  return JSON.parse(text.slice(i, j + 1)) as unknown;
}

describe("CRM tools — per-tool matrix (mock backend)", () => {
  const backend = new MockMinicrmBackend(fixturesDir);
  const ctx = { backend, useMock: true };

  it("exports exactly 12 tool names", () => {
    assert.equal(CRM_TOOL_NAMES.length, 12);
    const set = new Set(CRM_TOOL_NAMES);
    assert.equal(set.size, 12);
  });

  const cases: {
    tool: CrmToolName;
    successArgs: Record<string, unknown>;
    badArgs: Record<string, unknown>;
    emptyArgs?: Record<string, unknown>;
    errorArgs?: Record<string, unknown>;
  }[] = [
    {
      tool: "kontakt_kereses",
      successArgs: { nev: "test" },
      badArgs: { nev: true },
      emptyArgs: { nev: "empty" },
      errorArgs: { nev: "forbidden" },
    },
    {
      tool: "kontakt_lekeres",
      successArgs: { kontakt_id: 37147 },
      badArgs: {},
      errorArgs: { kontakt_id: 404 },
    },
    {
      tool: "kontakt_letrehozas",
      successArgs: {
        mezok: { FirstName: "T", LastName: "E", Type: "Person" },
      },
      badArgs: {},
      errorArgs: { mezok: { ValidationFail: true } },
    },
    {
      tool: "kontakt_modositas",
      successArgs: { kontakt_id: 37147, mezok: { Email: "a@b.c" } },
      badArgs: { kontakt_id: 37147 },
      errorArgs: {
        kontakt_id: 37147,
        mezok: { ValidationFail: true },
      },
    },
    {
      tool: "projekt_kereses",
      successArgs: { kategoria_id: 3, oldal: 0 },
      badArgs: { kategoria_id: true },
      emptyArgs: { oldal: 999 },
    },
    {
      tool: "projekt_lekeres",
      successArgs: { projekt_id: 160 },
      badArgs: {},
      errorArgs: { projekt_id: 404 },
    },
    {
      tool: "projekt_letrehozas",
      successArgs: {
        mezok: { CategoryId: 3, ContactId: 1, Name: "Unit" },
      },
      badArgs: {},
      errorArgs: { mezok: { ValidationFail: true } },
    },
    {
      tool: "projekt_statusz_valtas",
      successArgs: { projekt_id: 999, statusz_id: 425 },
      badArgs: { projekt_id: 999 },
    },
    {
      tool: "teendo_letrehozas",
      successArgs: {
        mezok: { ProjectId: 1, UserId: 1, Comment: "t" },
      },
      badArgs: {},
      errorArgs: { mezok: { ValidationFail: true } },
    },
    {
      tool: "teendo_lekeres",
      successArgs: { card_id: 12345 },
      badArgs: {},
      emptyArgs: { card_id: 0 },
    },
    {
      tool: "szamla_lekerdezes",
      successArgs: { oldal: 0 },
      badArgs: { oldal: true },
      emptyArgs: { oldal: 999 },
      errorArgs: { status_csoport: "forbidden" },
    },
    {
      tool: "schema_lekerdezes",
      successArgs: { sema_tipus: "Project/3" },
      badArgs: {},
      errorArgs: { sema_tipus: "__fail__" },
    },
  ];

  for (const row of cases) {
    describe(row.tool, () => {
      it("success", async () => {
        const r = await invokeCrmTool(row.tool, row.successArgs, ctx);
        assertSuccessWithMockPrefix(r);
      });

      it("bad input (zod)", async () => {
        const r = await invokeCrmTool(row.tool, row.badArgs, ctx);
        assertValidationError(r);
      });

      if (row.emptyArgs) {
        it("empty list / zero results", async () => {
          const r = await invokeCrmTool(row.tool, row.emptyArgs, ctx);
          assertSuccessWithMockPrefix(r);
          const data = parseJsonTail(textOf(r)) as { Count?: number };
          assert.equal(data.Count, 0);
          assert.ok(textOf(r).includes("Nincs találat"));
        });
      }

      if (row.errorArgs) {
        it("HTTP error mapping", async () => {
          const r = await invokeCrmTool(row.tool, row.errorArgs, ctx);
          assertHttpError(r, true);
        });
      }
    });
  }
});

describe("contact Type normalization on write tools", () => {
  class CaptureBackend {
    public lastReq: MinicrmRequest | null = null;

    async request(req: MinicrmRequest): Promise<MinicrmResponse> {
      this.lastReq = req;
      return { status: 200, bodyText: '{"Id":1}' };
    }
  }

  it("maps Type=2 to Person on kontakt_letrehozas", async () => {
    const backend = new CaptureBackend();
    const ctx = { backend, useMock: false };
    const r = await invokeCrmTool(
      "kontakt_letrehozas",
      { mezok: { FirstName: "Makram", LastName: "AlMoghrabi", Type: "2" } },
      ctx
    );
    assert.equal(r.isError, undefined);
    assert.equal((backend.lastReq?.body as Record<string, unknown>)?.Type, "Person");
  });

  it("maps Type=1 to Business on kontakt_modositas", async () => {
    const backend = new CaptureBackend();
    const ctx = { backend, useMock: false };
    const r = await invokeCrmTool(
      "kontakt_modositas",
      { kontakt_id: 103, mezok: { Type: 1 } },
      ctx
    );
    assert.equal(r.isError, undefined);
    assert.equal((backend.lastReq?.body as Record<string, unknown>)?.Type, "Business");
  });
});
