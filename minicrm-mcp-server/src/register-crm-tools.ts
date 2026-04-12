import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import type { MinicrmBackend, MinicrmRequest } from "./minicrm/types.js";

const mezokSchema = z
  .record(z.string(), z.unknown())
  .describe("Mezőnév → érték (miniCRM API JSON szerint).");

function buildSearch(params: Record<string, string | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    u.set(k, v);
  }
  return u.toString();
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
  req: MinicrmRequest
): Promise<CallToolResult> {
  const res = await backend.request(req);
  const body = parseBodyJson(res);
  const prefix = useMock ? "[Mock] " : "";
  const text = prefix + JSON.stringify(body, null, 2);
  if (res.status < 200 || res.status >= 300) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: prefix + JSON.stringify({ status: res.status, body }, null, 2),
        },
      ],
    };
  }
  return { content: [{ type: "text", text }] };
}

export function registerCrmTools(
  server: McpServer,
  backend: MinicrmBackend,
  options: { useMock: boolean }
): void {
  const { useMock } = options;

  server.registerTool(
    "kontakt_kereses",
    {
      description:
        "Kontaktok keresése név, e-mail vagy telefon alapján (GET /Api/R3/Contact).",
      inputSchema: {
        nev: z.string().optional().describe("Name query (API: Name)"),
        email: z.string().optional().describe("Email (API: Email)"),
        telefon: z.string().optional().describe("Phone (API: Phone)"),
      },
    },
    async ({ nev, email, telefon }) => {
      const search = buildSearch({
        Name: nev,
        Email: email,
        Phone: telefon,
      });
      return execCrm(backend, useMock, {
        method: "GET",
        pathname: "/Api/R3/Contact",
        search,
      });
    }
  );

  server.registerTool(
    "kontakt_lekeres",
    {
      description: "Egy kontakt részletes adatai Id alapján (GET /Api/R3/Contact/{Id}).",
      inputSchema: {
        kontakt_id: z.union([z.number(), z.string()]).describe("Kontakt Id"),
      },
    },
    async ({ kontakt_id }) => {
      const id = String(kontakt_id).replace(/\D/g, "") || String(kontakt_id);
      return execCrm(backend, useMock, {
        method: "GET",
        pathname: `/Api/R3/Contact/${id}`,
      });
    }
  );

  server.registerTool(
    "kontakt_letrehozas",
    {
      description:
        "Új kontakt létrehozása (PUT /Api/R3/Contact). Mezők: FirstName, LastName, Email, Phone, Type, stb.",
      inputSchema: { mezok: mezokSchema },
    },
    async ({ mezok }) => {
      return execCrm(backend, useMock, {
        method: "PUT",
        pathname: "/Api/R3/Contact",
        body: mezok,
      });
    }
  );

  server.registerTool(
    "kontakt_modositas",
    {
      description:
        "Kontakt módosítása (PUT /Api/R3/Contact/{Id}). A mezok csak a változó mezőket tartalmazza.",
      inputSchema: {
        kontakt_id: z.union([z.number(), z.string()]).describe("Kontakt Id"),
        mezok: mezokSchema,
      },
    },
    async ({ kontakt_id, mezok }) => {
      const id = String(kontakt_id).replace(/\D/g, "") || String(kontakt_id);
      return execCrm(backend, useMock, {
        method: "PUT",
        pathname: `/Api/R3/Contact/${id}`,
        body: mezok,
      });
    }
  );

  server.registerTool(
    "projekt_kereses",
    {
      description:
        "Projektek / ügyletek keresése (GET /Api/R3/Project). Szűrők: kategória, státusz, kontakt, tulajdonos, név.",
      inputSchema: {
        kategoria_id: z.union([z.number(), z.string()]).optional().describe("CategoryId"),
        statusz_id: z.union([z.number(), z.string()]).optional().describe("StatusId"),
        kontakt_id: z.union([z.number(), z.string()]).optional().describe("ContactId"),
        felhasznalo_id: z.union([z.number(), z.string()]).optional().describe("UserId"),
        nev: z.string().optional().describe("Name"),
        oldal: z.union([z.number(), z.string()]).optional().describe("Page (pagination)"),
      },
    },
    async (args) => {
      const search = buildSearch({
        CategoryId:
          args.kategoria_id !== undefined ? String(args.kategoria_id) : undefined,
        StatusId: args.statusz_id !== undefined ? String(args.statusz_id) : undefined,
        ContactId: args.kontakt_id !== undefined ? String(args.kontakt_id) : undefined,
        UserId:
          args.felhasznalo_id !== undefined ? String(args.felhasznalo_id) : undefined,
        Name: args.nev,
        Page: args.oldal !== undefined ? String(args.oldal) : undefined,
      });
      return execCrm(backend, useMock, {
        method: "GET",
        pathname: "/Api/R3/Project",
        search,
      });
    }
  );

  server.registerTool(
    "projekt_lekeres",
    {
      description: "Egy projekt / ügylet részletei Id alapján (GET /Api/R3/Project/{Id}).",
      inputSchema: {
        projekt_id: z.union([z.number(), z.string()]).describe("Projekt Id"),
      },
    },
    async ({ projekt_id }) => {
      const id = String(projekt_id).replace(/\D/g, "") || String(projekt_id);
      return execCrm(backend, useMock, {
        method: "GET",
        pathname: `/Api/R3/Project/${id}`,
      });
    }
  );

  server.registerTool(
    "projekt_letrehozas",
    {
      description:
        "Új projekt / ügylet létrehozása (PUT /Api/R3/Project). Kötelező mezők a fiók szabályaitól függenek (CategoryId, ContactId, Name, egyedi mezők).",
      inputSchema: { mezok: mezokSchema },
    },
    async ({ mezok }) => {
      return execCrm(backend, useMock, {
        method: "PUT",
        pathname: "/Api/R3/Project",
        body: mezok,
      });
    }
  );

  server.registerTool(
    "projekt_statusz_valtas",
    {
      description:
        "Csak státuszváltás egy projekten (PUT /Api/R3/Project/{Id}). A kérés törzse kizárólag StatusId — más mezőt ne küldjön.",
      inputSchema: {
        projekt_id: z.union([z.number(), z.string()]).describe("Projekt Id"),
        statusz_id: z.union([z.number(), z.string()]).describe("Új StatusId"),
      },
    },
    async ({ projekt_id, statusz_id }) => {
      const id = String(projekt_id).replace(/\D/g, "") || String(projekt_id);
      const statusIdValue =
        typeof statusz_id === "number"
          ? statusz_id
          : Number.isFinite(Number(statusz_id))
            ? Number(statusz_id)
            : statusz_id;
      return execCrm(backend, useMock, {
        method: "PUT",
        pathname: `/Api/R3/Project/${id}`,
        body: { StatusId: statusIdValue },
      });
    }
  );

  server.registerTool(
    "teendo_letrehozas",
    {
      description:
        "Teendő létrehozása (POST /Api/R3/ToDo/). Mezők: ProjectId, UserId, Deadline, Type, Comment (Integrations Manual szerint).",
      inputSchema: { mezok: mezokSchema },
    },
    async ({ mezok }) => {
      return execCrm(backend, useMock, {
        method: "POST",
        pathname: "/Api/R3/ToDo/",
        body: mezok,
      });
    }
  );

  server.registerTool(
    "teendo_lekeres",
    {
      description:
        "Teendőlista egy kártyához / projekthez (GET /Api/R3/ToDoList/{CardId}).",
      inputSchema: {
        card_id: z.union([z.number(), z.string()]).describe("CardId (általában projekt Id)"),
      },
    },
    async ({ card_id }) => {
      const id = String(card_id).replace(/\D/g, "") || String(card_id);
      return execCrm(backend, useMock, {
        method: "GET",
        pathname: `/Api/R3/ToDoList/${id}`,
      });
    }
  );

  server.registerTool(
    "szamla_lekerdezes",
    {
      description:
        "Kibocsátott számlák listája (GET /Api/Invoice/List). Szűrés: projekt, kontakt (ha az API támogatja), Page, UpdatedSince, StatusGroup.",
      inputSchema: {
        projekt_id: z.union([z.number(), z.string()]).optional().describe("ProjectId"),
        kontakt_id: z.union([z.number(), z.string()]).optional().describe("ContactId"),
        oldal: z.union([z.number(), z.string()]).optional().describe("Page"),
        frissitve: z.string().optional().describe("UpdatedSince"),
        status_csoport: z.string().optional().describe("StatusGroup"),
      },
    },
    async (args) => {
      const search = buildSearch({
        ProjectId:
          args.projekt_id !== undefined ? String(args.projekt_id) : undefined,
        ContactId:
          args.kontakt_id !== undefined ? String(args.kontakt_id) : undefined,
        Page: args.oldal !== undefined ? String(args.oldal) : undefined,
        UpdatedSince: args.frissitve,
        StatusGroup: args.status_csoport,
      });
      return execCrm(backend, useMock, {
        method: "GET",
        pathname: "/Api/Invoice/List",
        search,
      });
    }
  );

  server.registerTool(
    "schema_lekerdezes",
    {
      description:
        "Séma: kategóriák (GET /Api/R3/Category) + egy típus meződefiníciói (GET /Api/R3/Schema/{Type}). Type példák: Business, Person, Project/{CategoryId}.",
      inputSchema: {
        sema_tipus: z
          .string()
          .describe(
            'Schema útvonal a Category után, pl. "Business", "Person", "Project/3"'
          ),
      },
    },
    async ({ sema_tipus }) => {
      const typePath = sema_tipus.replace(/^\/+/, "");
      const cat = await backend.request({
        method: "GET",
        pathname: "/Api/R3/Category",
      });
      const sch = await backend.request({
        method: "GET",
        pathname: `/Api/R3/Schema/${typePath}`,
      });
      const catBody = parseBodyJson(cat);
      const schBody = parseBodyJson(sch);
      const prefix = useMock ? "[Mock] " : "";
      const ok = cat.status >= 200 && cat.status < 300 && sch.status >= 200 && sch.status < 300;
      const combined = { Category: catBody, Schema: schBody };
      const text = prefix + JSON.stringify(combined, null, 2);
      if (!ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text:
                prefix +
                JSON.stringify(
                  {
                    categoryStatus: cat.status,
                    schemaStatus: sch.status,
                    Category: catBody,
                    Schema: schBody,
                  },
                  null,
                  2
                ),
            },
          ],
        };
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
