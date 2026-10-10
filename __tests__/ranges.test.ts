import { describe, expect, it } from "vitest";
import { getRangeWindow, getSnapshotWindow } from "../src/api/ranges";

const TODAY = new Date("2026-10-10T12:00:00Z");

describe("getRangeWindow", () => {
  it("always ends today", () => {
    for (const range of ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const) {
      expect(getRangeWindow(range, TODAY).to).toBe("2026-10-10");
    }
  });

  it.each([
    ["1D", "2026-10-03"],
    ["1W", "2026-10-03"],
    ["1M", "2026-09-10"],
    ["3M", "2026-07-12"], // crosses two month boundaries
    ["1Y", "2025-10-10"],
  ] as const)("%s starts at %s", (range, from) => {
    expect(getRangeWindow(range, TODAY).from).toBe(from);
  });

  it("5Y starts about five years back and is grouped by week", () => {
    const w = getRangeWindow("5Y", TODAY);
    expect(w.from).toBe("2021-10-11"); // 1825 days back
    expect(w.group).toBe("week");
  });

  it("only 1D keeps a tail of two rates", () => {
    expect(getRangeWindow("1D", TODAY).tail).toBe(2);
    expect(getRangeWindow("1W", TODAY).tail).toBeUndefined();
  });

  it("does not mutate the date passed in", () => {
    const today = new Date("2026-10-10T12:00:00Z");
    getRangeWindow("1M", today);
    expect(today.toISOString()).toBe("2026-10-10T12:00:00.000Z");
  });
});

describe("getSnapshotWindow", () => {
  it("covers the last 7 days", () => {
    expect(getSnapshotWindow(TODAY)).toEqual({ from: "2026-10-03", to: "2026-10-10" });
  });
});