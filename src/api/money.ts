const formatters = new Map<string, Intl.NumberFormat>();

const getFormatter = (currency: string): Intl.NumberFormat => {
  const cached = formatters.get(currency);
  if (cached) return cached;

  let digits = 2;
  try {
    digits =
      new Intl.NumberFormat("en-GB", { style: "currency", currency }).resolvedOptions()
        .maximumFractionDigits ?? 2;
  } catch {
    digits = 2;
  }

  const formatter = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  formatters.set(currency, formatter);
  return formatter;
};

// A plain number with the currency's own number of decimals (JPY 0, USD 2).
export const formatMoney = (value: number, currency: string): string =>
  getFormatter(currency).format(value);