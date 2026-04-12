import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { coerceRecordId } from "./ids.js";

describe("coerceRecordId", () => {
  it("keeps plain numeric string", () => {
    assert.equal(coerceRecordId("37147"), "37147");
  });

  it("strips non-digits", () => {
    assert.equal(coerceRecordId("id:37147"), "37147");
  });

  it("accepts number", () => {
    assert.equal(coerceRecordId(37147), "37147");
  });

  it("falls back to original when no digits", () => {
    assert.equal(coerceRecordId("abc"), "abc");
  });
});
