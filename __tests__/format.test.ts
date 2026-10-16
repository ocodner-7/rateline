// __tests__/format.test.ts
import { describe, expect, it } from "vitest";
import { formatAmount, formatChangePct, formatRate, getDirection } from "../src/api/format";

describe("formatRate", () => {
  it.each([
    [150.2345, "150.23"], // 100 and above: 2 decimals
    [100, "100.00"], // boundary
    [1.3421, "1.3421"], // under 100: 4 decimals
    [0.5, "0.5000"], // fixed, not trimmed
    [99.99994, "99.9999"], // just under the boundary
    [15432.1, "15,432.10"], // thousands separator
  ])("formats %s as %s", (input, expected) => {
    expect(formatRate(input)).toBe(expected);
  });
});

describe("formatChangePct", () => {
  it.each([
    [0.42, "+0.42%"],
    [-0.18, "-0.18%"],
    [0, "0.00%"],
    [12.3456, "+12.35%"], // rounds to 2 decimals
    [-0.001, "0.00%"], // rounds to zero, so no sign
  ])("formats %s as %s", (input, expected) => {
    expect(formatChangePct(input)).toBe(expected);
  });
});

describe("getDirection", () => {
  it.each([
    [0.42, "up"],
    [-0.18, "down"],
    [0, "flat"],
    [0.0049, "flat"], // would display as 0.00%
    [-0.0049, "flat"],
    [0.005, "up"], // boundary: first value that displays as 0.01%
    [-0.005, "down"],
  ])("returns the right direction for %s", (input, expected) => {
    expect(getDirection(input)).toBe(expected);
  });

  it("agrees with the formatted sign", () => {
    // The arrow and the printed sign must never contradict each other
    for (const value of [0.001, -0.001, 0.004, -0.004, 0.006, -0.006]) {
      const text = formatChangePct(value);
      const direction = getDirection(value);
      if (direction === "flat") expect(text).toBe("0.00%");
      if (direction === "up") expect(text.startsWith("+")).toBe(true);
      if (direction === "down") expect(text.startsWith("-")).toBe(true);
    }
  });
});

describe("formatAmount", () => {
  it.each([
    ["1000", "1,000"],
    ["1000000", "1,000,000"],
    ["1000.5", "1,000.5"],
    ["1,000", "1,000"],
    [".5", "0.5"],
    ["0", "0"],
    ["12", "12"],
  ])("formats %j as %j", (input, expected) => {
    expect(formatAmount(input)).toBe(expected);
  });

  it.each([[""], ["abc"], ["1.2.3"]])("leaves %j unchanged", (input) => {
    expect(formatAmount(input)).toBe(input);
  });
});