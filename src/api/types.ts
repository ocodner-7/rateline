import { RateRowsSchema, CurrenciesSchema, RateRowSchema, Currency, CurrencyPairSchema, LogEntrySchema, LogSchema } from "../schemas";
import { z } from "zod";


// ====== regular types =======
export type Group = "week" | "month";
export type ArrowDirection = "flat" | "up" | "down";

// ====== interfaces ======
export interface SeriesPoint {
    date: string;
    rate: number;
}

export interface RangeMetrics {
  open: number;
  last: number;
  change: number;
  changePct: number;
}

export interface Snapshot {
  base: string;
  quote: string;
  rate: number;
  date: string;
  previousRate: number | null;
  previousDate: string | null;
  /** Change since the previous published rate, not a live 24h window. */
  change: number | null;
  changePct: number | null;
}

// ====== zod inferered types ======
export type RateRow = z.infer<typeof RateRowSchema>;
export type RateRows = z.infer<typeof RateRowsSchema>;

export type Currency = z.infer<typeof Currency>;
export type Currencies = z.infer<typeof CurrenciesSchema>;
export type CurrencyPair = z.infer<typeof CurrencyPairSchema>;

export type LogEntry = z.infer<typeof LogEntrySchema>;
export type NewLogEntry = Omit<LogEntry, "id" | "loggedAt">;
export type Log = z.infer<typeof LogSchema>;