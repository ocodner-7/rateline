import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  readFavourites,
  writeFavourites,
  STORAGE_KEY,
  setFavourites,
  useFavourites,
} from "../src/api/favourites";

describe("readFavourites", () => {
  beforeEach(() => localStorage.clear());

  it("returns [] when nothing is saved", () => {
    const result = readFavourites();
    expect(result).toEqual([]);
  });

  it("returns the saved list after writeFavourites saved it", () => {
    const pairs = [{ base: "GBP", quote: "USD" }];
    writeFavourites(pairs);
    const result = readFavourites();
    expect(result).toEqual(pairs);
  });

  it("returns [] when the stored text isn't valid JSON", () => {
    const badData = "not json";
    localStorage.setItem(STORAGE_KEY, badData);

    const result = readFavourites();

    expect(result).toEqual([]);
  });

  it("returns [] when the stored JSON is the wrong shape", () => {
    const wrongShape = JSON.stringify([{ foo: "bar" }]);
    localStorage.setItem(STORAGE_KEY, wrongShape);
    const result = readFavourites();
    expect(result).toEqual([]);
  });
});

describe("useFavourites", () => {
  beforeEach(() => {
    act(() => setFavourites([]));
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
      // toggle once
      result.current.toggle(pair);

      // toggle again
      result.current.toggle(pair);
    });

    expect(result.current.favourites).toEqual([]);
  });

  it("treats lowercase and uppercase as the same pair", () => {
    const { result } = renderHook(() => useFavourites());
    const pair = { base: "gbp", quote: "usd" };

    act(() => result.current.toggle(pair));

    expect(result.current.isFavourite({ base: "GBP", quote: "USD" })).toBe(true);
    expect(result.current.favourites).toEqual([{ base: "GBP", quote: "USD" }]);
  });
});
