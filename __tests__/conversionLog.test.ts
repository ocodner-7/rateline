// __tests__/conversionLog.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  LOG_STORAGE_KEY,
  MAXIMUM_LOG_ENTRIES,
  useConversionLog,
} from "../src/api/conversionLog";
import type { NewLogEntry } from "../src/api/types";

const sample: NewLogEntry = {
  base: "GBP",
  quote: "USD",
  amount: 100,
  rate: 1.25,
  result: 125,
};

// Same entry, different amount, so tests can tell entries apart
const makeEntry = (amount: number): NewLogEntry => ({ ...sample, amount });

describe("useConversionLog", () => {
  beforeEach(() => {
    // The store is shared across tests, so empty it before each one
    const { result } = renderHook(() => useConversionLog());
    act(() => result.current.clear());
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useConversionLog());
    expect(result.current.entries).toEqual([]);
  });

  it("add stores the entry and fills in id and loggedAt", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => result.current.add(sample));

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0]).toEqual({
      ...sample,
      id: expect.any(String),
      loggedAt: expect.any(String),
    });
  });

  it("puts the newest entry first", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => {
      result.current.add(makeEntry(1));
      result.current.add(makeEntry(2));
    });

    expect(result.current.entries.map((e) => e.amount)).toEqual([2, 1]);
  });

  it("gives every entry a different id", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => {
      result.current.add(makeEntry(1));
      result.current.add(makeEntry(2));
    });

    const [a, b] = result.current.entries;
    expect(a.id).not.toBe(b.id);
  });

  it("caps the log at MAXIMUM_LOG_ENTRIES, dropping the oldest", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => {
      // MAX + 1 entries, with amounts 0..MAX
      for (let i = 0; i <= MAXIMUM_LOG_ENTRIES; i++) {
        result.current.add(makeEntry(i));
      }
    });

    const amounts = result.current.entries.map((e) => e.amount);
    expect(amounts).toHaveLength(MAXIMUM_LOG_ENTRIES);
    expect(amounts[0]).toBe(MAXIMUM_LOG_ENTRIES); // newest kept, at the top
    expect(amounts).not.toContain(0); // oldest dropped
  });

  it("remove deletes only that entry", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => {
      result.current.add(makeEntry(1));
      result.current.add(makeEntry(2));
    });
    const newestId = result.current.entries[0].id;

    act(() => result.current.remove(newestId));

    expect(result.current.entries.map((e) => e.amount)).toEqual([1]);
  });

  it("clear empties the list", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => result.current.add(sample));
    act(() => result.current.clear());

    expect(result.current.entries).toEqual([]);
  });

  it("saves to localStorage", () => {
    const { result } = renderHook(() => useConversionLog());

    act(() => result.current.add(sample));

    const saved = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY)!);
    expect(saved).toEqual(result.current.entries);
  });
});