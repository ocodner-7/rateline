import { z } from "zod";

export const RateRowSchema = z.object({
  date: z.string(),
  base: z.string(),
  quote: z.string(),
  rate: z.number().positive(),
});

export const RateRowsSchema = z.array(RateRowSchema);

export const Currency = z.object({
  iso_code: z.string(),
  name: z.string(),
  symbol: z.string().nullable().optional(),
});

export const CurrenciesSchema = z.array(Currency);

export const ApiErrorBodySchema = z.object({ message: z.string() });

export const CurrencyPairSchema = z.object({
  base: z.string(),
  quote: z.string(),
});

export const FavouritesSchema = z.array(CurrencyPairSchema);

export const LogEntrySchema = z.object({
  id: z.string(),
  base: z.string(),
  quote: z.string(),
  amount: z.number(),
  rate: z.number(),
  result: z.number(),
  loggedAt: z.string(),
});
