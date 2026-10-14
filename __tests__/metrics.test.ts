import { describe, expect, it } from "vitest";
import { applyTail, computeMetrics, computeSnapshots, convert, toSeries } from "../src/api/metrics";
import { parseAmount } from "../src/api/metrics";

const row = (date: string, quote: string, rate: number) => ({
  date,
  base: "GBP",
  quote,
  rate,
});

describe("toSeries", () => {
  it("keeps only the requested quote and sorts oldest first", () => {
    const rows = [
      row("2026-10-09", "USD", 1.35),
      row("2026-10-08", "USD", 1.3),
      row("2026-10-09", "EUR", 1.15),
    ];
    expect(toSeries(rows, "USD")).toEqual([
      { date: "2026-10-08", rate: 1.3 },
      { date: "2026-10-09", rate: 1.35 },
    ]);
  });

  it("ignores case on the quote", () => {
    expect(toSeries([row("2026-10-09", "USD", 1.35)], "usd")).toHaveLength(1);
  });

  it("returns an empty array when the quote isn't present", () => {
    expect(toSeries([row("2026-10-09", "USD", 1.35)], "JPY")).toEqual([]);
  });
});

describe("applyTail", () => {
  it("keeps the last n items", () => {
    expect(applyTail([1, 2, 3], 2)).toEqual([2, 3]);
  });

  it("keeps everything when n is undefined", () => {
    expect(applyTail([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe("computeMetrics", () => {
  it("derives open, last, change and percent change", () => {
    const m = computeMetrics([
      { date: "a", rate: 1.0 },
      { date: "b", rate: 1.1 },
      { date: "c", rate: 1.2 },
    ]);
    expect(m?.open).toBe(1.0);
    expect(m?.last).toBe(1.2);
    expect(m?.change).toBeCloseTo(0.2);
    expect(m?.changePct).toBeCloseTo(20);
  });

  it("reports a fall as a negative change", () => {
    const m = computeMetrics([
      { date: "a", rate: 2 },
      { date: "b", rate: 1 },
    ]);
    expect(m?.change).toBeCloseTo(-1);
    expect(m?.changePct).toBeCloseTo(-50);
  });

  it("returns null for an empty series", () => {
    expect(computeMetrics([])).toBeNull();
  });
});

describe("computeSnapshots", () => {
  it("compares the latest rate with the previous one, from unsorted rows", () => {
    const rows = [
      row("2026-10-09", "USD", 1.35),
      row("2026-10-07", "USD", 1.28),
      row("2026-10-08", "USD", 1.3),
    ];
    const [usd] = computeSnapshots(rows, ["USD"]);
    expect(usd).toMatchObject({
      quote: "USD",
      date: "2026-10-09",
      rate: 1.35,
      previousRate: 1.3,
    });
    expect(usd.change).toBeCloseTo(0.05); // vs previous day, not vs the first day
    expect(usd.changePct).toBeCloseTo((0.05 / 1.3) * 100);
  });

  it("returns one snapshot per quote, in the order requested", () => {
    const rows = [
      row("2026-10-08", "USD", 1.3),
      row("2026-10-09", "USD", 1.35),
      row("2026-10-08", "EUR", 1.15),
      row("2026-10-09", "EUR", 1.16),
    ];
    const result = computeSnapshots(rows, ["EUR", "USD"]);
    expect(result.map((s) => s.quote)).toEqual(["EUR", "USD"]);
  });

  it("returns nulls for the change fields when there is only one data point", () => {
    const [s] = computeSnapshots([row("2026-10-09", "JPY", 200)], ["JPY"]);
    expect(s).toMatchObject({
      rate: 200,
      previousRate: null,
      change: null,
      changePct: null,
    });
  });

  it("skips quotes with no rows", () => {
    expect(computeSnapshots([], ["USD"])).toEqual([]);
  });

  it("converts between currencies properly", () => {
    const amount = 100;
    const rate = 1.56;

    const expected = 156;
    const converted = convert(amount, rate);

    expect(converted).toBeCloseTo(expected);
  });
});

describe("parseAmount", () => {
  it.each([
    ["1000", 1000],
    ["1,000", 1000],
    ["1,000,000", 1000000],
    ["1000.5", 1000.5],
    ["1,000.50", 1000.5],
    [".5", 0.5],
    ["0", 0],
    ["  12  ", 12],
    ["1e3", 1000]
  ])("parses %j as %d", (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each([
    [""],
    ["   "],
    ["abc"],
    ["12abc"],
    ["1.2.3"],
    ["-5"],
    ["Infinity"],
    ["NaN"],
  ])("returns null for %j", (input) => {
    expect(parseAmount(input)).toBeNull();
  });
});