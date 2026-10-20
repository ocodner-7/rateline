export const COMPARE_CURRENCIES = [
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "INR",
  "CNY",
  "BDT",
];

const FALLBACK = "USD";

// The base currency cannot be compared against itself, so we fallback to USD
export const getCompareQuotes = (base: string): string[] => {
  return COMPARE_CURRENCIES.map((code) => (code === base ? FALLBACK : code));
};
