import type { Currency } from "./types";

export const POPULAR_GROUP = "Popular";
export const OTHER_GROUP = "Other Currencies";

// Popular has more entries than it shows, so the count beside the title means something.
// AUD is deliberately not here: the design lists it in Other Currencies.
export const POPULAR_CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "CHF",
  "CNY",
];

// How many items each group shows while the search box is empty.
// A group without an entry shows everything (and scrolls).
export const GROUP_LIMITS: Record<string, number> = {
  [POPULAR_GROUP]: 7,
//   [OTHER_GROUP]: 4,
};

export type CurrencyGroup = { value: string; items: Currency[] };
export type DisplayGroup = CurrencyGroup & { total: number };

export const groupCurrencies = (
  currencies: Currency[],
  popularCodes: string[],
): CurrencyGroup[] => {
  // look-up table so finding a popular currency is one step each
  const byCode = new Map(
    currencies.map((currency): [string, Currency] => [
      currency.iso_code,
      currency,
    ]),
  );

  // popular, in the popularCodes order; codes the API didn't return are skipped
  const popular = popularCodes.flatMap((code) => {
    const currency = byCode.get(code);
    return currency ? [currency] : [];
  });

  // everything else, alphabetical by code
  const popularSet = new Set(popularCodes);
  const other = currencies
    .filter((currency) => !popularSet.has(currency.iso_code))
    .sort((a, b) => a.iso_code.localeCompare(b.iso_code));

  const groups: CurrencyGroup[] = [
    { value: POPULAR_GROUP, items: popular },
    { value: OTHER_GROUP, items: other },
  ];

  return groups.filter((group) => group.items.length > 0);
};

const matchesQuery = (currency: Currency, query: string): boolean =>
  currency.iso_code.toLowerCase().includes(query) ||
  currency.name.toLowerCase().includes(query);

export const getDisplayGroups = (
  groups: CurrencyGroup[],
  query: string,
  limits: Record<string, number> = GROUP_LIMITS,
): DisplayGroup[] => {
  const normalised = query.trim().toLowerCase();
  const isSearching = normalised !== "";

  return groups
    .map((group) => {
      const matching = isSearching
        ? group.items.filter((currency) => matchesQuery(currency, normalised))
        : group.items;
      const limit = isSearching ? undefined : limits[group.value];

      return {
        value: group.value,
        items: limit === undefined ? matching : matching.slice(0, limit),
        total: matching.length,
      };
    })
    .filter((group) => group.items.length > 0);
};