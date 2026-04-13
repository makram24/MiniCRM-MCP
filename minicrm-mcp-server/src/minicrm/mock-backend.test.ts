import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { MockMinicrmBackend } from "./mock-backend.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "../../fixtures");

describe("MockMinicrmBackend edge fixtures", () => {
  const backend = new MockMinicrmBackend(fixturesDir);

  it("returns empty contact list for Name=empty", async () => {
    const res = await backend.request({
      method: "GET",
      pathname: "/Api/R3/Contact",
      search: "Name=empty",
    });
    assert.equal(res.status, 200);
    const body = JSON.parse(res.bodyText) as { Count?: number };
    assert.equal(body.Count, 0);
  });

  it("returns 403-like error for forbidden search", async () => {
    const res = await backend.request({
      method: "GET",
      pathname: "/Api/R3/Contact",
      search: "Name=forbidden",
    });
    assert.equal(res.status, 403);
  });

  it("returns 404 fixture for missing contact id", async () => {
    const res = await backend.request({
      method: "GET",
      pathname: "/Api/R3/Contact/404",
    });
    assert.equal(res.status, 404);
  });

  it("supports out-of-range pagination fixtures", async () => {
    const res = await backend.request({
      method: "GET",
      pathname: "/Api/R3/Project",
      search: "Page=999",
    });
    assert.equal(res.status, 200);
    const body = JSON.parse(res.bodyText) as { Count?: number };
    assert.equal(body.Count, 0);
  });

  it("returns 400-like validation error for write endpoints", async () => {
    const contactCreate = await backend.request({
      method: "PUT",
      pathname: "/Api/R3/Contact",
      body: { ValidationFail: true },
    });
    assert.equal(contactCreate.status, 400);

    const projectCreate = await backend.request({
      method: "PUT",
      pathname: "/Api/R3/Project",
      body: { ValidationFail: true },
    });
    assert.equal(projectCreate.status, 400);

    const todoCreate = await backend.request({
      method: "POST",
      pathname: "/Api/R3/ToDo/",
      body: { ValidationFail: true },
    });
    assert.equal(todoCreate.status, 400);
  });
});
