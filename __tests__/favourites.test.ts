// __tests__/favourites.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  FAVOURITES_STORAGE_KEY,
  resetFavourites,
  useFavourites,
} from "../src/api/favourites";

describe("useFavourites", () => {
  beforeEach(() => {
    act(() => resetFavourites());
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([]);
  });

  it("toggle adds a pair", () => {
    const { result } = renderHook(() => useFavourites());
    const pair = { base: "GBP", quote: "USD" };

    act(() => result.current.toggle(pair));

    expect(result.current.favourites).toEqual([pair]);
    expect(result.current.isFavourite(pair)).toBe(true);
  });

  it("toggling the same pair twice removes it again", () => {
    const { result } = renderHook(() => useFavourites());
    const pair = { base: "GBP", quote: "USD" };

    act(() => {
      result.current.toggle(pair);
      result.current.toggle(pair);
    });

    expect(result.current.favourites).toEqual([]);
  });

  it("treats lowercase and uppercase as the same pair", () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggle({ base: "gbp", quote: "usd" }));

    expect(result.current.isFavourite({ base: "GBP", quote: "USD" })).toBe(true);
    expect(result.current.favourites).toEqual([{ base: "GBP", quote: "USD" }]);
  });

  it("saves favourites to localStorage", () => {
    const { result } = renderHook(() => useFavourites());
    const pair = { base: "GBP", quote: "USD" };

    act(() => result.current.toggle(pair));

    expect(JSON.parse(localStorage.getItem(FAVOURITES_STORAGE_KEY)!)).toEqual([pair]);
  });

  it("two hooks stay in sync through the shared store", () => {
    const first = renderHook(() => useFavourites());
    const second = renderHook(() => useFavourites());
    const pair = { base: "GBP", quote: "USD" };

    act(() => first.result.current.toggle(pair));

    expect(second.result.current.isFavourite(pair)).toBe(true);
  });
});