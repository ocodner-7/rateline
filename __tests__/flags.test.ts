import { describe, expect, it } from "vitest";
import { getFlagUrl } from "../src/api/flags";

describe("getFlagUrl", () => {
  it.each(["USD", "EUR", "GBP", "JPY", "AED", "ZAR"])(
    "finds a flag for %s",
    (code) => {
      expect(getFlagUrl(code)).toEqual(expect.any(String));
    },
  );

  it("gives different currencies different flags", () => {
    expect(getFlagUrl("USD")).not.toBe(getFlagUrl("EUR"));
  });

  it("ignores case and surrounding spaces", () => {
    expect(getFlagUrl(" usd ")).toBe(getFlagUrl("USD"));
  });

  it.each(["XXX", "X", ""])("returns undefined for %j", (code) => {
    expect(getFlagUrl(code)).toBeUndefined();
  });
});