// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  getXTicks,
  getYAxisScale,
  getYTicks,
  withAlpha,
} from "../src/api/chart";

describe("getYTicks", () => {
  it("returns null for no values", () => {
    expect(getYTicks([])).toBeNull();
  });

  it("returns the lowest, middle and highest values", () => {
    const ticks = getYTicks([0.84, 0.86, 0.85]);
    expect(ticks?.min).toBe(0.84);
    expect(ticks?.max).toBe(0.86);
    expect(ticks?.mid).toBeCloseTo(0.85, 10);
  });

  it("returns the same value three times for a flat series", () => {
    expect(getYTicks([2, 2, 2])).toEqual({ min: 2, mid: 2, max: 2 });
  });
});

describe("getYAxisScale", () => {
  it("returns null for no values", () => {
    expect(getYAxisScale([])).toBeNull();
  });

  it("sits the axis exactly on the lowest and highest values", () => {
    const scale = getYAxisScale([0.84, 0.86, 0.85]);
    expect(scale).not.toBeNull();
    expect(scale?.min).toBe(0.84);
    expect(scale?.max).toBe(0.86);
    expect(scale?.ticks[0]).toBe(0.84);
    expect(scale?.ticks[1]).toBeCloseTo(0.85, 10);
    expect(scale?.ticks[2]).toBe(0.86);
  });

  it("gives a flat series a small range with three distinct ticks", () => {
    const scale = getYAxisScale([1.5, 1.5, 1.5]);
    expect(scale).not.toBeNull();
    expect(scale!.min).toBeLessThan(1.5);
    expect(scale!.max).toBeGreaterThan(1.5);
    expect(scale!.ticks[1]).toBe(1.5);
    expect(new Set(scale!.ticks).size).toBe(3);
  });

  it("handles a single value", () => {
    expect(getYAxisScale([2])?.ticks[1]).toBe(2);
  });
});

describe("getXTicks", () => {
  it("returns nothing for no times", () => {
    expect(getXTicks([])).toEqual([]);
  });

  it("returns a single tick when there is one time", () => {
    expect(getXTicks([100])).toEqual([100]);
  });

  it("returns the first, middle and last times", () => {
    expect(getXTicks([0, 10, 20, 30, 40])).toEqual([0, 20, 40]);
  });
});

describe("withAlpha", () => {
  it("converts a six digit hex colour", () => {
    expect(withAlpha("#c6f432", 0.5)).toBe("rgba(198, 244, 50, 0.5)");
  });

  it("converts a three digit hex colour", () => {
    expect(withAlpha("#fff", 0.25)).toBe("rgba(255, 255, 255, 0.25)");
  });

  it("accepts a hex colour without the hash and surrounding spaces", () => {
    expect(withAlpha("  000000 ", 1)).toBe("rgba(0, 0, 0, 1)");
  });

  it("passes non-hex colours through unchanged", () => {
    expect(withAlpha("rgb(1, 2, 3)", 0.5)).toBe("rgb(1, 2, 3)");
  });
});