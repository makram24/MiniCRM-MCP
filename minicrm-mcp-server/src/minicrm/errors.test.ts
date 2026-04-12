import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildHttpErrorPayload,
  hungarianMessageForHttpStatus,
} from "./errors.js";

describe("hungarianMessageForHttpStatus", () => {
  it("maps 401", () => {
    assert.ok(hungarianMessageForHttpStatus(401).includes("hitelesítés"));
  });

  it("maps 429", () => {
    assert.ok(hungarianMessageForHttpStatus(429).includes("Túl sok"));
  });
});

describe("buildHttpErrorPayload", () => {
  it("live mode includes uzenetHu", () => {
    const p = buildHttpErrorPayload(false, 404, { x: 1 });
    assert.equal(p.uzenetHu, hungarianMessageForHttpStatus(404));
    assert.equal(p.httpStatus, 404);
    assert.deepEqual(p.reszletek, { x: 1 });
  });

  it("mock mode keeps simple shape", () => {
    const p = buildHttpErrorPayload(true, 500, null);
    assert.equal(p.status, 500);
    assert.equal(p.body, null);
  });
});
