import { describe, expect, it } from "vitest";
import { formatLoggedAt } from "../src/api/time";

const NOW = Date.UTC(2026, 9, 19, 12, 0, 0);
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const MINUTE = 60_000;
const HOUR = 3_600_000;

describe("formatLoggedAt", () => {
  it("says NOW for the first minute and for clock skew", () => {
    expect(formatLoggedAt(ago(10_000), NOW)).toBe("NOW");
    expect(formatLoggedAt(ago(-5 * MINUTE), NOW)).toBe("NOW");
  });

  it("uses minutes under an hour", () => {
    expect(formatLoggedAt(ago(20 * MINUTE), NOW)).toBe("20M");
    expect(formatLoggedAt(ago(59 * MINUTE), NOW)).toBe("59M");
  });

  it("uses hours under a day", () => {
    expect(formatLoggedAt(ago(60 * MINUTE), NOW)).toBe("1H");
    expect(formatLoggedAt(ago(4 * HOUR), NOW)).toBe("4H");
    expect(formatLoggedAt(ago(23 * HOUR + 59 * MINUTE), NOW)).toBe("23H");
  });

  it("uses a short date from a day onwards", () => {
    expect(formatLoggedAt(ago(72 * HOUR), NOW)).toMatch(/^\d{1,2} Oct$/);
  });

  it("includes the year when it isn't this year", () => {
    expect(formatLoggedAt(new Date(Date.UTC(2025, 4, 13, 12)).toISOString(), NOW)).toMatch(
      /^1[23] May 2025$/,
    );
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatLoggedAt("nonsense", NOW)).toBe("");
  });
});