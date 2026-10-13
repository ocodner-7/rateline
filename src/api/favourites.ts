import { useCallback, useSyncExternalStore } from "react";
import { FavouritesSchema } from "../schemas";
import type { CurrencyPair } from "./types";
import { createLocalStore } from "./store";
import { createPairKey } from "./pairs";


export const FAVOURITES_STORAGE_KEY = "rateline:favourites:v1";

const EMPTY_FAVOURITES: CurrencyPair[] = [];

const favouritesStore = createLocalStore(
  FAVOURITES_STORAGE_KEY,
  FavouritesSchema,
  EMPTY_FAVOURITES,
);

export const useFavourites = () => {
  const favourites = useSyncExternalStore(
    favouritesStore.subscribe,
    favouritesStore.get,
  );

  const isFavourite = useCallback(
    (pair: CurrencyPair) =>
      favourites.some((f) => createPairKey(f) === createPairKey(pair)),
    [favourites],
  );

  const toggle = useCallback((pair: CurrencyPair) => {
    const savedFavourites = favouritesStore.get();
    const exists = savedFavourites.some(
      (fave) => createPairKey(fave) === createPairKey(pair),
    );

    favouritesStore.set(
      exists
        ? savedFavourites.filter(
            (f) => createPairKey(f) !== createPairKey(pair),
          )
        : [
            ...savedFavourites,
            { base: pair.base.toUpperCase(), quote: pair.quote.toUpperCase() },
          ],
    );
  }, []);

  return { favourites, isFavourite, toggle };
};

export const resetFavourites = () => favouritesStore.set([]);