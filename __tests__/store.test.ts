import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createLocalStore } from "../src/api/store";

const KEY = "test:store";
const FALLBACK: string[] = [];
const Schema = z.array(z.string());

// The store reads localStorage once, when it's created.
// So each test builds its own store *after* setting up storage.
const makeStore = () => createLocalStore(KEY, Schema, FALLBACK);

describe("createLocalStore", () => {
  beforeEach(() => localStorage.clear());

  describe("reading", () => {
    it("returns the fallback when nothing is saved", () => {
      const store = makeStore();
      expect(store.get()).toBe(FALLBACK);
    });

    it("returns saved data that matches the schema", () => {
      localStorage.setItem(KEY, JSON.stringify(["a", "b"]));
      const store = makeStore();
      expect(store.get()).toEqual(["a", "b"]);
    });

    it("returns the fallback when the stored text isn't valid JSON", () => {
      localStorage.setItem(KEY, "not json");
      const store = makeStore();
      expect(store.get()).toBe(FALLBACK);
    });

    it("returns the fallback when the stored JSON is the wrong shape", () => {
      localStorage.setItem(KEY, JSON.stringify([{ foo: "bar" }]));
      const store = makeStore();
      expect(store.get()).toBe(FALLBACK);
    });

    it("returns the same reference on every get() (stable snapshot)", () => {
      localStorage.setItem(KEY, JSON.stringify(["a"]));
      const store = makeStore();
      expect(store.get()).toBe(store.get());
    });
  });

  describe("writing", () => {
    it("set() updates what get() returns", () => {
      const store = makeStore();
      store.set(["x"]);
      expect(store.get()).toEqual(["x"]);
    });

    it("set() saves to localStorage", () => {
      const store = makeStore();
      store.set(["x"]);
      expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(["x"]);
    });

    it("a new store with the same key sees what the old one saved", () => {
      makeStore().set(["persisted"]);
      const reloaded = makeStore();
      expect(reloaded.get()).toEqual(["persisted"]);
    });

    it("still updates in memory if localStorage throws", () => {
      const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const store = makeStore();
      store.set(["x"]);

      expect(store.get()).toEqual(["x"]);
      spy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("subscribe", () => {
    it("calls the listener when set() runs", () => {
      const store = makeStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.set(["x"]);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("stops calling the listener after unsubscribe", () => {
      const store = makeStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.set(["x"]);

      expect(listener).not.toHaveBeenCalled();
    });

    it("notifies every subscriber", () => {
      const store = makeStore();
      const a = vi.fn();
      const b = vi.fn();
      store.subscribe(a);
      store.subscribe(b);

      store.set(["x"]);

      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });
  });
});