import type { Currency, CurrencyGroup } from "./types";

export const POPULAR_CURRENCY_CODES = ["USD", "EUR", "GBP"];

export const groupCurrencies = (currencies: Currency[], popularCodes: string[]): CurrencyGroup[] => {
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
    { value: "Popular", items: popular },
    { value: "Other Currencies", items: other },
  ];

  return groups.filter((group) => group.items.length > 0);
};