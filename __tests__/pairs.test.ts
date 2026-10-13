// __tests__/pairs.test.ts
import { describe, expect, it } from "vitest";
import { createPairKey, groupByBase } from "../src/api/pairs";

describe("createPairKey", () => {
  it("joins base and quote", () => {
    expect(createPairKey({ base: "GBP", quote: "USD" })).toBe("GBP/USD");
  });

  it("is case-insensitive", () => {
    expect(createPairKey({ base: "gbp", quote: "usd" })).toBe("GBP/USD");
  });
});

describe("groupByBase", () => {
  it("returns an empty object for no pairs", () => {
    expect(groupByBase([])).toEqual({});
  });

  it("groups quotes under their base", () => {
    const result = groupByBase([
      { base: "USD", quote: "JPY" },
      { base: "GBP", quote: "USD" },
      { base: "USD", quote: "CHF" },
    ]);

    expect(result).toEqual({
      USD: ["JPY", "CHF"],
      GBP: ["USD"],
    });
  });

  it("keeps quotes in the order they were given", () => {
    const result = groupByBase([
      { base: "USD", quote: "CHF" },
      { base: "USD", quote: "JPY" },
      { base: "USD", quote: "CAD" },
    ]);

    expect(result.USD).toEqual(["CHF", "JPY", "CAD"]);
  });

  it("treats lowercase and uppercase codes as the same", () => {
    const result = groupByBase([
      { base: "usd", quote: "jpy" },
      { base: "USD", quote: "CHF" },
    ]);

    expect(result).toEqual({ USD: ["JPY", "CHF"] });
  });

  it("doesn't repeat a quote for the same base", () => {
    const result = groupByBase([
      { base: "USD", quote: "JPY" },
      { base: "usd", quote: "jpy" },
    ]);

    expect(result).toEqual({ USD: ["JPY"] });
  });
});