/**
 * Single source for CRM MCP tool schemas + handlers (register + test invoke).
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { appendEmptyListNote } from "./minicrm/empty-results.js";
import {
  buildHttpErrorPayload,
  hungarianMessageForHttpStatus,
} from "./minicrm/errors.js";
import { coerceRecordId } from "./minicrm/ids.js";
import { logToolInvocation, shouldLogToolInvocation } from "./minicrm/log.js";
import { normalizeStatusIdForBody } from "./minicrm/project-status.js";
import { buildSearchParamsString } from "./minicrm/search-params.js";
import type { MinicrmBackend, MinicrmRequest } from "./minicrm/types.js";

export type CrmToolCtx = {
  backend: MinicrmBackend;
  useMock: boolean;
};

const mezokSchema = z
  .record(z.string(), z.unknown())
  .describe("Mezőnév → érték (miniCRM API JSON szerint).");

function normalizeContactTypeValue(value: unknown): unknown {
  if (typeof value !== "string" && typeof value !== "number") return value;
  const raw = String(value).trim().toLowerCase();
  if (raw === "2" || raw === "person" || raw === "szemely" || raw === "személy") {
    return "Person";
  }
  if (raw === "1" || raw === "business" || raw === "ceg" || raw === "cég") {
    return "Business";
  }
  return value;
}

function normalizeContactWriteFields(
  mezok: Record<string, unknown>
): Record<string, unknown> {
  if (!Object.prototype.hasOwnProperty.call(mezok, "Type")) return mezok;
  return {
    ...mezok,
    Type: normalizeContactTypeValue(mezok.Type),
  };
}

function parseBodyJson(res: { status: number; bodyText: string }): unknown {
  const t = res.bodyText.trim();
  if (t === "") return null;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return { nyersValasz: res.bodyText };
  }
}

async function execCrm(
  backend: MinicrmBackend,
  useMock: boolean,
  req: MinicrmRequest,
  toolName: string,
  reqId: string
): Promise<CallToolResult> {
  const t0 = Date.now();
  const res = await backend.request(req);
  const ms = Date.now() - t0;
  if (shouldLogToolInvocation(useMock)) {
    logToolInvocation({
      ts: new Date().toISOString(),
      reqId,
      tool: toolName,
      ms,
      status: res.status,
      path: req.pathname,
    });
  }

  const body = parseBodyJson(res);
  const prefix = useMock ? "[Mock] " : "";
  if (res.status < 200 || res.status >= 300) {
    const payload = buildHttpErrorPayload(useMock, res.status, body);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: prefix + JSON.stringify(payload, null, 2),
        },
      ],
    };
  }
  const text =
    prefix + JSON.stringify(body, null, 2) + appendEmptyListNote(body);
  return { content: [{ type: "text", text }] };
}

const kontaktKeresesSchema = z.object({
  nev: z.string().optional().describe("Name query (API: Name)"),
  email: z.string().optional().describe("Email (API: Email)"),
  telefon: z.string().optional().describe("Phone (API: Phone)"),
});

const kontaktLekeresSchema = z.object({
  kontakt_id: z.union([z.number(), z.string()]).describe("Kontakt Id"),
});

const kontaktLetrehozasSchema = z.object({ mezok: mezokSchema });

const kontaktModositasSchema = z.object({
  kontakt_id: z.union([z.number(), z.string()]).describe("Kontakt Id"),
  mezok: mezokSchema,
});

const projektKeresesSchema = z.object({
  kategoria_id: z.union([z.number(), z.string()]).optional().describe("CategoryId"),
  statusz_id: z.union([z.number(), z.string()]).optional().describe("StatusId"),
  kontakt_id: z.union([z.number(), z.string()]).optional().describe("ContactId"),
  felhasznalo_id: z.union([z.number(), z.string()]).optional().describe("UserId"),
  nev: z.string().optional().describe("Name"),
  oldal: z.union([z.number(), z.string()]).optional().describe("Page (pagination)"),
});

const projektLekeresSchema = z.object({
  projekt_id: z.union([z.number(), z.string()]).describe("Projekt Id"),
});

const projektLetrehozasSchema = z.object({ mezok: mezokSchema });

const projektStatuszValtasSchema = z.object({
  projekt_id: z.union([z.number(), z.string()]).describe("Projekt Id"),
  statusz_id: z.union([z.number(), z.string()]).describe("Új StatusId"),
});

const teendoLetrehozasSchema = z.object({ mezok: mezokSchema });

const teendoLekeresSchema = z.object({
  card_id: z.union([z.number(), z.string()]).describe("CardId (általában projekt Id)"),
});

const szamlaLekerdezesSchema = z.object({
  projekt_id: z.union([z.number(), z.string()]).optional().describe("ProjectId"),
  kontakt_id: z.union([z.number(), z.string()]).optional().describe("ContactId"),
  oldal: z.union([z.number(), z.string()]).optional().describe("Page"),
  frissitve: z.string().optional().describe("UpdatedSince"),
  status_csoport: z.string().optional().describe("StatusGroup"),
});

const schemaLekerdezesSchema = z.object({
  sema_tipus: z
    .string()
    .describe(
      'Schema path after /Api/R3/Schema/, e.g. "Business", "Person", "Project/{CategoryId}" where CategoryId exists in GET /Api/R3/Category (not necessarily 3)'
    ),
});

export type CrmToolName =
  | "kontakt_kereses"
  | "kontakt_lekeres"
  | "kontakt_letrehozas"
  | "kontakt_modositas"
  | "projekt_kereses"
  | "projekt_lekeres"
  | "projekt_letrehozas"
  | "projekt_statusz_valtas"
  | "teendo_letrehozas"
  | "teendo_lekeres"
  | "szamla_lekerdezes"
  | "schema_lekerdezes";

export const CRM_TOOL_NAMES: readonly CrmToolName[] = [
  "kontakt_kereses",
  "kontakt_lekeres",
  "kontakt_letrehozas",
  "kontakt_modositas",
  "projekt_kereses",
  "projekt_lekeres",
  "projekt_letrehozas",
  "projekt_statusz_valtas",
  "teendo_letrehozas",
  "teendo_lekeres",
  "szamla_lekerdezes",
  "schema_lekerdezes",
] as const;

type CrmToolDef = {
  readonly name: CrmToolName;
  readonly description: string;
  readonly inputSchema: z.ZodObject<z.ZodRawShape>;
  readonly execute: (args: unknown, ctx: CrmToolCtx) => Promise<CallToolResult>;
};

function shapeOf(schema: z.ZodObject<z.ZodRawShape>): z.ZodRawShape {
  return schema.shape;
}

const CRM_TOOL_DEFINITIONS: readonly CrmToolDef[] = [
  {
    name: "kontakt_kereses",
    description:
      "Kontaktok keresése név, e-mail vagy telefon alapján (GET /Api/R3/Contact).",
    inputSchema: kontaktKeresesSchema,
    async execute(args, ctx) {
      const { nev, email, telefon } = kontaktKeresesSchema.parse(args);
      const reqId = randomUUID();
      const search = buildSearchParamsString({
        Name: nev,
        Email: email,
        Phone: telefon,
      });
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "GET", pathname: "/Api/R3/Contact", search },
        "kontakt_kereses",
        reqId
      );
    },
  },
  {
    name: "kontakt_lekeres",
    description: "Egy kontakt részletes adatai Id alapján (GET /Api/R3/Contact/{Id}).",
    inputSchema: kontaktLekeresSchema,
    async execute(args, ctx) {
      const { kontakt_id } = kontaktLekeresSchema.parse(args);
      const reqId = randomUUID();
      const id = coerceRecordId(kontakt_id);
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "GET", pathname: `/Api/R3/Contact/${id}` },
        "kontakt_lekeres",
        reqId
      );
    },
  },
  {
    name: "kontakt_letrehozas",
    description:
      "Új kontakt létrehozása (PUT /Api/R3/Contact). Mezők: FirstName, LastName, Email, Phone, Type, stb.",
    inputSchema: kontaktLetrehozasSchema,
    async execute(args, ctx) {
      const { mezok } = kontaktLetrehozasSchema.parse(args);
      const reqId = randomUUID();
      const body = normalizeContactWriteFields(mezok);
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "PUT", pathname: "/Api/R3/Contact", body },
        "kontakt_letrehozas",
        reqId
      );
    },
  },
  {
    name: "kontakt_modositas",
    description:
      "Kontakt módosítása (PUT /Api/R3/Contact/{Id}). A mezok csak a változó mezőket tartalmazza.",
    inputSchema: kontaktModositasSchema,
    async execute(args, ctx) {
      const { kontakt_id, mezok } = kontaktModositasSchema.parse(args);
      const reqId = randomUUID();
      const id = coerceRecordId(kontakt_id);
      const body = normalizeContactWriteFields(mezok);
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "PUT", pathname: `/Api/R3/Contact/${id}`, body },
        "kontakt_modositas",
        reqId
      );
    },
  },
  {
    name: "projekt_kereses",
    description:
      "Projektek / ügyletek keresése (GET /Api/R3/Project). Szűrők: kategória, státusz, kontakt, tulajdonos, név.",
    inputSchema: projektKeresesSchema,
    async execute(args, ctx) {
      const a = projektKeresesSchema.parse(args);
      const reqId = randomUUID();
      const search = buildSearchParamsString({
        CategoryId:
          a.kategoria_id !== undefined ? String(a.kategoria_id) : undefined,
        StatusId: a.statusz_id !== undefined ? String(a.statusz_id) : undefined,
        ContactId: a.kontakt_id !== undefined ? String(a.kontakt_id) : undefined,
        UserId:
          a.felhasznalo_id !== undefined ? String(a.felhasznalo_id) : undefined,
        Name: a.nev,
        Page: a.oldal !== undefined ? String(a.oldal) : undefined,
      });
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "GET", pathname: "/Api/R3/Project", search },
        "projekt_kereses",
        reqId
      );
    },
  },
  {
    name: "projekt_lekeres",
    description: "Egy projekt / ügylet részletei Id alapján (GET /Api/R3/Project/{Id}).",
    inputSchema: projektLekeresSchema,
    async execute(args, ctx) {
      const { projekt_id } = projektLekeresSchema.parse(args);
      const reqId = randomUUID();
      const id = coerceRecordId(projekt_id);
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "GET", pathname: `/Api/R3/Project/${id}` },
        "projekt_lekeres",
        reqId
      );
    },
  },
  {
    name: "projekt_letrehozas",
    description:
      "Új projekt / ügylet létrehozása (PUT /Api/R3/Project). Kötelező mezők a fiók szabályaitól függenek (CategoryId, ContactId, Name, egyedi mezők).",
    inputSchema: projektLetrehozasSchema,
    async execute(args, ctx) {
      const { mezok } = projektLetrehozasSchema.parse(args);
      const reqId = randomUUID();
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "PUT", pathname: "/Api/R3/Project", body: mezok },
        "projekt_letrehozas",
        reqId
      );
    },
  },
  {
    name: "projekt_statusz_valtas",
    description:
      "Csak státuszváltás egy projekten (PUT /Api/R3/Project/{Id}). A kérés törzse kizárólag StatusId — más mezőt ne küldjön.",
    inputSchema: projektStatuszValtasSchema,
    async execute(args, ctx) {
      const { projekt_id, statusz_id } = projektStatuszValtasSchema.parse(args);
      const reqId = randomUUID();
      const id = coerceRecordId(projekt_id);
      return execCrm(
        ctx.backend,
        ctx.useMock,
        {
          method: "PUT",
          pathname: `/Api/R3/Project/${id}`,
          body: { StatusId: normalizeStatusIdForBody(statusz_id) },
        },
        "projekt_statusz_valtas",
        reqId
      );
    },
  },
  {
    name: "teendo_letrehozas",
    description:
      "Teendő létrehozása (PUT /Api/R3/ToDo/). Mezők: ProjectId, UserId, Deadline, Type, Comment — élő API: PUT; POST ezen a tenanton 405.",
    inputSchema: teendoLetrehozasSchema,
    async execute(args, ctx) {
      const { mezok } = teendoLetrehozasSchema.parse(args);
      const reqId = randomUUID();
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "PUT", pathname: "/Api/R3/ToDo/", body: mezok },
        "teendo_letrehozas",
        reqId
      );
    },
  },
  {
    name: "teendo_lekeres",
    description:
      "Teendőlista egy kártyához / projekthez (GET /Api/R3/ToDoList/{CardId}).",
    inputSchema: teendoLekeresSchema,
    async execute(args, ctx) {
      const { card_id } = teendoLekeresSchema.parse(args);
      const reqId = randomUUID();
      const id = coerceRecordId(card_id);
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "GET", pathname: `/Api/R3/ToDoList/${id}` },
        "teendo_lekeres",
        reqId
      );
    },
  },
  {
    name: "szamla_lekerdezes",
    description:
      "Kibocsátott számlák listája (GET /Api/Invoice/List). Szűrés: projekt, kontakt (ha az API támogatja), Page, UpdatedSince, StatusGroup.",
    inputSchema: szamlaLekerdezesSchema,
    async execute(args, ctx) {
      const a = szamlaLekerdezesSchema.parse(args);
      const reqId = randomUUID();
      const search = buildSearchParamsString({
        ProjectId:
          a.projekt_id !== undefined ? String(a.projekt_id) : undefined,
        ContactId:
          a.kontakt_id !== undefined ? String(a.kontakt_id) : undefined,
        Page: a.oldal !== undefined ? String(a.oldal) : undefined,
        UpdatedSince: a.frissitve,
        StatusGroup: a.status_csoport,
      });
      return execCrm(
        ctx.backend,
        ctx.useMock,
        { method: "GET", pathname: "/Api/Invoice/List", search },
        "szamla_lekerdezes",
        reqId
      );
    },
  },
  {
    name: "schema_lekerdezes",
    description:
      "Séma: kategóriák (GET /Api/R3/Category) + egy típus meződefiníciói (GET /Api/R3/Schema/{Type}). Type példák: Business, Person, Project/{CategoryId}.",
    inputSchema: schemaLekerdezesSchema,
    async execute(args, ctx) {
      const { sema_tipus } = schemaLekerdezesSchema.parse(args);
      const reqId = randomUUID();
      const typePath = sema_tipus.replace(/^\/+/, "");
      const reqCat: MinicrmRequest = {
        method: "GET",
        pathname: "/Api/R3/Category",
      };
      const tCat = Date.now();
      const cat = await ctx.backend.request(reqCat);
      if (shouldLogToolInvocation(ctx.useMock)) {
        logToolInvocation({
          ts: new Date().toISOString(),
          reqId,
          tool: "schema_lekerdezes",
          ms: Date.now() - tCat,
          status: cat.status,
          path: reqCat.pathname,
        });
      }
      const schemaPath = `/Api/R3/Schema/${typePath}`;
      const tSch = Date.now();
      const sch = await ctx.backend.request({
        method: "GET",
        pathname: schemaPath,
      });
      if (shouldLogToolInvocation(ctx.useMock)) {
        logToolInvocation({
          ts: new Date().toISOString(),
          reqId,
          tool: "schema_lekerdezes",
          ms: Date.now() - tSch,
          status: sch.status,
          path: schemaPath,
        });
      }
      const catBody = parseBodyJson(cat);
      const schBody = parseBodyJson(sch);
      const prefix = ctx.useMock ? "[Mock] " : "";
      const catOk = cat.status >= 200 && cat.status < 300;
      const schOk = sch.status >= 200 && sch.status < 300;
      const ok = catOk && schOk;
      const combined = { Category: catBody, Schema: schBody };
      const text = prefix + JSON.stringify(combined, null, 2);
      if (!ok) {
        const payload = ctx.useMock
          ? {
              categoryStatus: cat.status,
              schemaStatus: sch.status,
              Category: catBody,
              Schema: schBody,
            }
          : {
              uzenetHu: !catOk && !schOk
                ? "A kategóriák és a séma lekérése is sikertelen volt."
                : !catOk
                  ? hungarianMessageForHttpStatus(cat.status)
                  : hungarianMessageForHttpStatus(sch.status),
              categoryHttp: cat.status,
              schemaHttp: sch.status,
              reszletek: { Category: catBody, Schema: schBody },
            };
        return {
          isError: true,
          content: [{ type: "text", text: prefix + JSON.stringify(payload, null, 2) }],
        };
      }
      return { content: [{ type: "text", text }] };
    },
  },
];

const toolByName = new Map<CrmToolName, CrmToolDef>(
  CRM_TOOL_DEFINITIONS.map((d) => [d.name, d])
);

/** For tests: same validation + execution path as MCP, without the SDK. */
export async function invokeCrmTool(
  name: CrmToolName,
  rawArgs: unknown,
  ctx: CrmToolCtx
): Promise<CallToolResult> {
  const def = toolByName.get(name);
  if (!def) {
    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
    };
  }
  const parsed = def.inputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Input validation error: ${parsed.error.message}`,
        },
      ],
    };
  }
  return def.execute(parsed.data, ctx);
}

export function registerCrmTools(
  server: McpServer,
  backend: MinicrmBackend,
  options: { useMock: boolean }
): void {
  const ctx: CrmToolCtx = { backend, useMock: options.useMock };
  for (const def of CRM_TOOL_DEFINITIONS) {
    server.registerTool(
      def.name,
      {
        description: def.description,
        inputSchema: shapeOf(def.inputSchema),
      },
      async (args: Record<string, unknown>) => def.execute(args, ctx)
    );
  }
}
