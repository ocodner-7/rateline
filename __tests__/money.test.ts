import { describe, expect, it } from "vitest";
import { formatMoney } from "../src/api/money";

describe("formatMoney", () => {
  it("uses two decimals for most currencies", () => {
    expect(formatMoney(1000, "USD")).toBe("1,000.00");
    expect(formatMoney(853.024, "EUR")).toBe("853.02");
  });

  it("uses no decimals for yen", () => {
    expect(formatMoney(92490.4, "JPY")).toBe("92,490");
  });

  it("falls back to two decimals for a code Intl rejects", () => {
    expect(formatMoney(5, "??")).toBe("5.00");
  });
});