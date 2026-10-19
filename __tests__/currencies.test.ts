import { describe, expect, it } from "vitest";
import { getDisplayGroups, groupCurrencies } from "../src/api/currencies";

const make = (iso_code: string) => ({
  iso_code,
  name: iso_code,
  symbol: iso_code,
});

const POPULAR = ["USD", "EUR", "GBP"];
const codes = (items: { iso_code: string }[]) => items.map((c) => c.iso_code);

describe("groupCurrencies", () => {
  const all = ["BDT", "GBP", "AUD", "USD", "AED", "EUR", "ARS"].map(make);

  it("puts popular currencies first, in the popular order", () => {
    const [popular] = groupCurrencies(all, POPULAR);
    expect(popular.value).toBe("Popular");
    expect(codes(popular.items)).toEqual(["USD", "EUR", "GBP"]);
  });

  it("sorts the rest by code and excludes the popular ones", () => {
    const [, other] = groupCurrencies(all, POPULAR);
    expect(other.value).toBe("Other Currencies");
    expect(codes(other.items)).toEqual(["AED", "ARS", "AUD", "BDT"]);
  });

  it("skips popular codes missing from the data", () => {
    const [popular] = groupCurrencies(["GBP", "AED"].map(make), POPULAR);
    expect(codes(popular.items)).toEqual(["GBP"]);
  });

  it("leaves out empty groups", () => {
    expect(groupCurrencies([], POPULAR)).toEqual([]);
    const onlyOther = groupCurrencies(["AED"].map(make), POPULAR);
    expect(onlyOther.map((g) => g.value)).toEqual(["Other Currencies"]);
  });

  it("does not mutate its input", () => {
    const input = ["BDT", "AED"].map(make);
    const before = [...input];
    groupCurrencies(input, POPULAR);
    expect(input).toEqual(before);
  });
});

describe("getDisplayGroups", () => {
  const all = ["USD", "EUR", "GBP", "JPY", "AED", "ARS", "AUD", "BDT"].map(make);
  const groups = groupCurrencies(all, ["USD", "EUR", "GBP", "JPY"]);
  const limits = { Popular: 3 };

  it("cuts limited groups and reports full totals when not searching", () => {
    const [popular, other] = getDisplayGroups(groups, "", limits);
    expect(codes(popular.items)).toEqual(["USD", "EUR", "GBP"]);
    expect(popular.total).toBe(4);
    expect(codes(other.items)).toEqual(["AED", "ARS", "AUD", "BDT"]);
    expect(other.total).toBe(4);
  });

  it("ignores limits and filters everything while searching", () => {
    const result = getDisplayGroups(groups, "j", limits);
    expect(result.map((group) => group.value)).toEqual(["Popular"]);
    expect(codes(result[0].items)).toEqual(["JPY"]);
    expect(result[0].total).toBe(1);
  });

  it("matches on the name as well as the code, ignoring case and spaces", () => {
    const euro = [{ iso_code: "EUR", name: "Euro", symbol: "€" }];
    const result = getDisplayGroups(groupCurrencies(euro, []), "  EURO ", limits);
    expect(codes(result[0].items)).toEqual(["EUR"]);
  });

  it("returns no groups when nothing matches", () => {
    expect(getDisplayGroups(groups, "zzz", limits)).toEqual([]);
  });
});