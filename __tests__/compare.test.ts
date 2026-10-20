import { describe, expect, it } from "vitest";
import { COMPARE_CURRENCIES, getCompareQuotes } from "../src/api/compare";

describe("getCompareQuotes", () => {
  it("returns the design when the base isn't in it", () => {
    expect(getCompareQuotes("USD")).toEqual([...COMPARE_CURRENCIES]);
    expect(getCompareQuotes("EUR")).toEqual([...COMPARE_CURRENCIES]);
  });

  it("swaps the base for the USD in the same position", () => {
    expect(getCompareQuotes("GBP")).toEqual([
      "USD",
      "JPY",
      "CHF",
      "CAD",
      "AUD",
      "INR",
      "CNY",
      "BDT",
    ]);
    expect(getCompareQuotes("BDT")[7]).toBe("USD");
  });

  it("always returns eight unique currencies and never the base", () => {
    for (const base of [...COMPARE_CURRENCIES, "USD", "EUR"]) {
      const quotes = getCompareQuotes(base);
      expect(quotes).toHaveLength(8);
      expect(new Set(quotes).size).toBe(8);
      expect(quotes).not.toContain(base);
    }
  });
});
