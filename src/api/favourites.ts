import { useCallback, useSyncExternalStore } from "react";
import { FavouritesSchema } from "../schemas";
import { normaliseCode } from "./api";
import type { CurrencyPair } from "./types";

export const createPairKey = (pair: CurrencyPair) => {
  return `${normaliseCode(pair.base)}/${normaliseCode(pair.quote)}`;
};

export const STORAGE_KEY = "rateline:favourites:v1";

export const readFavourites = (): CurrencyPair[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    const result = FavouritesSchema.safeParse(parsed);
    if (!result.success) return [];
    return result.data;
  } catch {
    return [];
  }
};

export const writeFavourites = (favourites: CurrencyPair[]) => {
  try {
    const serialised = JSON.stringify(favourites);
    localStorage.setItem(STORAGE_KEY, serialised);
  } catch (error) {
    console.error(error);
  }
};

let current = readFavourites();

const listeners = new Set<() => void>();

export const getSnapshot = () => current;

export const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const setFavourites = (next: CurrencyPair[]) => {
  current = next;
  writeFavourites(next);
  listeners.forEach((l) => l());
};

export const useFavourites = () => {
  const favourites = useSyncExternalStore(subscribe, getSnapshot);

  const isFavourite = useCallback(
    (pair: CurrencyPair) =>
      favourites.some((f) => createPairKey(f) === createPairKey(pair)),
    [favourites],
  );

  const toggle = useCallback((pair: CurrencyPair) => {
    const savedtFavourites = getSnapshot();
    const exists = savedtFavourites.some(
      (fave) => createPairKey(fave) === createPairKey(pair),
    );

    setFavourites(
      exists
        ? savedtFavourites.filter((f) => createPairKey(f) !== createPairKey(pair))
        : [
            ...savedtFavourites,
            { base: pair.base.toUpperCase(), quote: pair.quote.toUpperCase() },
          ],
    );
  }, []);

  return { favourites, isFavourite, toggle };
};
