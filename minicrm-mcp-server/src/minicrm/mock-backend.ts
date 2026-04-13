import fs from "node:fs";
import path from "node:path";

import type { MinicrmBackend, MinicrmRequest, MinicrmResponse } from "./types.js";

function normPath(pathname: string): string {
  const p = pathname.replace(/\/+$/, "") || "/";
  return p;
}

function q(search?: string): URLSearchParams {
  return new URLSearchParams(search || "");
}

export class MockMinicrmBackend implements MinicrmBackend {
  constructor(private readonly fixturesDir: string) {}

  private load(fixtureBaseName: string): string {
    const file = path.join(this.fixturesDir, `${fixtureBaseName}.json`);
    return fs.readFileSync(file, "utf8");
  }

  async request(req: MinicrmRequest): Promise<MinicrmResponse> {
    const method = req.method;
    const p = normPath(req.pathname);
    const body = req.body as Record<string, unknown> | undefined;

    if (method === "GET" && p === "/Api/R3/Category") {
      return { status: 200, bodyText: this.load("category") };
    }

    if (method === "GET" && p === "/Api/R3/Contact") {
      const query = q(req.search);
      if (query.get("Name") === "empty") {
        return { status: 200, bodyText: this.load("contact-search-empty") };
      }
      if (query.get("Name") === "forbidden") {
        return { status: 403, bodyText: this.load("error-forbidden") };
      }
      return { status: 200, bodyText: this.load("contact-search") };
    }

    const contactId = p.match(/^\/Api\/R3\/Contact\/(\d+)$/);
    if (method === "GET" && contactId) {
      if (contactId[1] === "404") {
        return { status: 404, bodyText: this.load("error-not-found") };
      }
      return { status: 200, bodyText: this.load("contact-detail") };
    }

    if (method === "PUT" && p === "/Api/R3/Contact") {
      if (body?.ValidationFail === true) {
        return { status: 400, bodyText: this.load("error-validation") };
      }
      return { status: 200, bodyText: JSON.stringify({ Id: 99999 }) };
    }

    if (method === "PUT" && contactId) {
      if (body?.ValidationFail === true) {
        return { status: 400, bodyText: this.load("error-validation") };
      }
      const id = Number(contactId[1]);
      return { status: 200, bodyText: JSON.stringify({ Id: id }) };
    }

    if (method === "GET" && p === "/Api/R3/Project") {
      const query = q(req.search);
      if (query.get("Page") === "999") {
        return { status: 200, bodyText: this.load("project-list-empty") };
      }
      return { status: 200, bodyText: this.load("project-list") };
    }

    const projectId = p.match(/^\/Api\/R3\/Project\/(\d+)$/);
    if (method === "GET" && projectId) {
      if (projectId[1] === "404") {
        return { status: 404, bodyText: this.load("error-not-found") };
      }
      return { status: 200, bodyText: this.load("project-detail") };
    }

    if (method === "PUT" && p === "/Api/R3/Project") {
      if (body?.ValidationFail === true) {
        return { status: 400, bodyText: this.load("error-validation") };
      }
      return { status: 200, bodyText: JSON.stringify({ Id: 88888 }) };
    }

    if (method === "PUT" && projectId) {
      const id = Number(projectId[1]);
      return { status: 200, bodyText: JSON.stringify({ Id: id }) };
    }

    if (method === "POST" && (p === "/Api/R3/ToDo" || p === "/Api/R3/ToDo/")) {
      if (body?.ValidationFail === true) {
        return { status: 400, bodyText: this.load("error-validation") };
      }
      return { status: 200, bodyText: JSON.stringify({ Id: 1111 }) };
    }

    const todoList = p.match(/^\/Api\/R3\/ToDoList\/(\d+)$/);
    if (method === "GET" && todoList) {
      if (todoList[1] === "0") {
        return { status: 200, bodyText: this.load("todolist-empty") };
      }
      return { status: 200, bodyText: this.load("todolist") };
    }

    if (
      method === "GET" &&
      (p === "/Api/Invoice" || p === "/Api/Invoice/List")
    ) {
      const query = q(req.search);
      if (query.get("Page") === "999") {
        return { status: 200, bodyText: this.load("invoice-search-empty") };
      }
      if (query.get("StatusGroup") === "forbidden") {
        return { status: 403, bodyText: this.load("error-forbidden") };
      }
      return { status: 200, bodyText: this.load("invoice-search") };
    }

    if (method === "GET" && p === "/Api/R3/Schema/__fail__") {
      return { status: 404, bodyText: this.load("error-not-found") };
    }

    if (method === "GET" && p.startsWith("/Api/R3/Schema/")) {
      return { status: 200, bodyText: this.load("schema-project") };
    }

    return {
      status: 404,
      bodyText: JSON.stringify({
        Message: "Mock: nincs illeszkedő útvonal",
        method,
        pathname: req.pathname,
      }),
    };
  }
}
