import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { appendEmptyListNote } from "./empty-results.js";

describe("appendEmptyListNote", () => {
  it("adds note when Count is 0", () => {
    assert.ok(
      appendEmptyListNote({ Count: 0, Results: {} }).includes("Nincs találat")
    );
  });

  it("adds note when Results object has no keys", () => {
    assert.ok(appendEmptyListNote({ Results: {} }).includes("Nincs találat"));
  });

  it("adds note when Results array empty", () => {
    assert.ok(appendEmptyListNote({ Results: [] }).includes("Nincs találat"));
  });

  it("no note for normal hit", () => {
    assert.equal(
      appendEmptyListNote({ Count: 1, Results: { a: {} } }),
      ""
    );
  });
});
