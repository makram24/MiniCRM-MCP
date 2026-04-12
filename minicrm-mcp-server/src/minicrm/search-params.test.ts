import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildSearchParamsString } from "./search-params.js";

describe("buildSearchParamsString", () => {
  it("omits undefined and empty string", () => {
    assert.equal(
      buildSearchParamsString({ Name: "a", Email: undefined, Phone: "" }),
      "Name=a"
    );
  });

  it("encodes special characters", () => {
    assert.equal(
      buildSearchParamsString({ Name: "a b" }),
      "Name=a+b"
    );
  });

  it("joins multiple params", () => {
    const s = buildSearchParamsString({
      CategoryId: "3",
      Page: "0",
      Name: "x",
    });
    assert.ok(s.includes("CategoryId=3"));
    assert.ok(s.includes("Page=0"));
    assert.ok(s.includes("Name=x"));
  });
});
