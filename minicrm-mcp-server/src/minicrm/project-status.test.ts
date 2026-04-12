import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeStatusIdForBody } from "./project-status.js";

describe("normalizeStatusIdForBody", () => {
  it("returns number as-is", () => {
    assert.equal(normalizeStatusIdForBody(425), 425);
  });

  it("parses numeric string to number", () => {
    assert.equal(normalizeStatusIdForBody("426"), 426);
  });

  it("returns non-numeric string unchanged", () => {
    assert.equal(normalizeStatusIdForBody("Open"), "Open");
  });
});

describe("projekt_statusz_valtas body shape", () => {
  it("object has only StatusId key", () => {
    const body = { StatusId: normalizeStatusIdForBody(428) };
    assert.deepEqual(Object.keys(body).sort(), ["StatusId"]);
    assert.equal(body.StatusId, 428);
  });
});
