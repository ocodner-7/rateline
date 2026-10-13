import { normaliseCode } from "./api";
import type { CurrencyPair } from "./types";

export const createPairKey = (pair: CurrencyPair) => {
  return `${normaliseCode(pair.base)}/${normaliseCode(pair.quote)}`;
};

export const groupByBase = (
  pairs: CurrencyPair[],
): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};

  for (const pair of pairs) {
    const base = normaliseCode(pair.base);
    const quote = normaliseCode(pair.quote);

    grouped[base] ??= [];
    if (!grouped[base].includes(quote)) grouped[base].push(quote);
  }

  return grouped;
};
