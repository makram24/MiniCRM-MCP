import fs from "node:fs";
import path from "node:path";

import type { MinicrmBackend, MinicrmRequest, MinicrmResponse } from "./types.js";

function normPath(pathname: string): string {
  const p = pathname.replace(/\/+$/, "") || "/";
  return p;
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

    if (method === "GET" && p === "/Api/R3/Category") {
      return { status: 200, bodyText: this.load("category") };
    }

    if (method === "GET" && p === "/Api/R3/Contact") {
      return { status: 200, bodyText: this.load("contact-search") };
    }

    const contactId = p.match(/^\/Api\/R3\/Contact\/(\d+)$/);
    if (method === "GET" && contactId) {
      return { status: 200, bodyText: this.load("contact-detail") };
    }

    if (method === "PUT" && p === "/Api/R3/Contact") {
      return { status: 200, bodyText: JSON.stringify({ Id: 99999 }) };
    }

    if (method === "PUT" && contactId) {
      const id = Number(contactId[1]);
      return { status: 200, bodyText: JSON.stringify({ Id: id }) };
    }

    if (method === "GET" && p === "/Api/R3/Project") {
      return { status: 200, bodyText: this.load("project-list") };
    }

    const projectId = p.match(/^\/Api\/R3\/Project\/(\d+)$/);
    if (method === "GET" && projectId) {
      return { status: 200, bodyText: this.load("project-detail") };
    }

    if (method === "PUT" && p === "/Api/R3/Project") {
      return { status: 200, bodyText: JSON.stringify({ Id: 88888 }) };
    }

    if (method === "PUT" && projectId) {
      const id = Number(projectId[1]);
      return { status: 200, bodyText: JSON.stringify({ Id: id }) };
    }

    if (method === "POST" && (p === "/Api/R3/ToDo" || p === "/Api/R3/ToDo/")) {
      return { status: 200, bodyText: JSON.stringify({ Id: 1111 }) };
    }

    const todoList = p.match(/^\/Api\/R3\/ToDoList\/(\d+)$/);
    if (method === "GET" && todoList) {
      return { status: 200, bodyText: this.load("todolist") };
    }

    if (
      method === "GET" &&
      (p === "/Api/Invoice" || p === "/Api/Invoice/List")
    ) {
      return { status: 200, bodyText: this.load("invoice-search") };
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
