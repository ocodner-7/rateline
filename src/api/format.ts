import { parseAmount } from "./metrics";
import type { ArrowDirection } from "./types";

const ratesLarge = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ratesSmall = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const pctFormatter = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
})

export const formatRate = (rate: number) => {
  return rate >= 100 ? ratesLarge.format(rate) : ratesSmall.format(rate);
};

export const formatChangePct = (changePct: number) => {
  return `${pctFormatter.format(changePct)}%`;
};

export const getDirection = (changePct: number): ArrowDirection => {
  if (Math.abs(changePct) < 0.005) return "flat";
  if (changePct > 0) return "up";
  return "down";
};

const thousandsFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 20,
});

export const formatAmount = (raw: string): string => {
  // if raw can't be parsed safely, return it unchanged
  const parsed: number | null = parseAmount(raw);
  if(parsed === null) return raw;

  // otherwise return raw as a number with thousands separators
  return thousandsFormatter.format(parsed)
};