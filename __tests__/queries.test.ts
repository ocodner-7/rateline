import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { ApiError } from "../src/api/api";
import { shouldRetry } from "../src/api/queries";

describe("shouldRetry", () => {
  it("does not retry a 4xx ApiError", () => {
    expect(shouldRetry(0, new ApiError(404, "not found"))).toBe(false);
  });

  it("retries a 5xx ApiError", () => {
    expect(shouldRetry(0, new ApiError(500, "server error"))).toBe(true);
  });

  it("does not retry a ZodError", () => {
    expect(shouldRetry(0, new ZodError([]))).toBe(false);
  });

  it("gives up after two retries", () => {
    expect(shouldRetry(2, new ApiError(500, "server error"))).toBe(false);
  });
});