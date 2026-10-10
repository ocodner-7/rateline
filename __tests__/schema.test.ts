import { describe, expect, it } from "vitest";
import { RateRowsSchema } from "../src/schemas";

describe("RateRowsSchema", () => {
  it("accepts the v2 shape (flat array of rows)", () => {
    const v2 = [
      { date: "2026-10-09", base: "GBP", quote: "USD", rate: 1.35 },
      { date: "2026-10-09", base: "GBP", quote: "EUR", rate: 1.15 },
    ];
    expect(RateRowsSchema.parse(v2)).toEqual(v2);
  });

  it("rejects the v1 shape (object keyed by date)", () => {
    const v1 = { base: "GBP", date: "2026-10-09", rates: { USD: 1.35, EUR: 1.15 } };
    expect(RateRowsSchema.safeParse(v1).success).toBe(false);
  });

  it("rejects a non-positive rate", () => {
    const bad = [{ date: "2026-10-09", base: "GBP", quote: "USD", rate: 0 }];
    expect(RateRowsSchema.safeParse(bad).success).toBe(false);
  });
});