import { ZodError } from "zod";
import {
  ApiError,
  getCurrencies,
  getRate,
  getRates,
  normaliseCode,
} from "./api";
import {
  applyTail,
  computeMetrics,
  computeSnapshots,
  toSeries,
} from "./metrics";
import { getRangeWindow, getSnapshotWindow, type Range } from "./ranges";
import { useQuery, queryOptions, useQueries } from "@tanstack/react-query";
import type { CurrencyPair } from "./types";
import { createPairKey, groupByBase } from "./pairs";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const fxKeys = {
  all: ["fx"] as const,
  currencies: () => [...fxKeys.all, "currencies"] as const,
  rate: (base: string, quote: string) =>
    [...fxKeys.all, "rate", normaliseCode(base), normaliseCode(quote)] as const,
  snapshots: (base: string, quotes: string[]) => {
    const normalisedQuotes = quotes.map((q) => normaliseCode(q)).sort();
    return [
      ...fxKeys.all,
      "snapshots",
      normaliseCode(base),
      normalisedQuotes,
    ] as const;
  },
  series: (base: string, quote: string, range: Range) =>
    [
      ...fxKeys.all,
      "series",
      normaliseCode(base),
      normaliseCode(quote),
      range,
    ] as const,
};

export const shouldRetry = (failureCount: number, error: unknown) => {
  if (error instanceof ApiError && error.status < 500) return false;
  if (error instanceof ZodError) return false;
  return failureCount < 2;
};

export const currenciesQuery = () =>
  queryOptions({
    queryKey: fxKeys.currencies(),
    queryFn: ({ signal }) => getCurrencies(signal),
    staleTime: DAY,
    gcTime: 7 * DAY,
    retry: shouldRetry,
  });

export const rateQuery = (base: string, quote: string) =>
  queryOptions({
    queryKey: fxKeys.rate(base, quote),
    queryFn: ({ signal }) => getRate(base, quote, signal),
    staleTime: HOUR,
    retry: shouldRetry,
  });

export const snapshotsQuery = (base: string, quotes: string[]) =>
  queryOptions({
    queryKey: fxKeys.snapshots(base, quotes),
    queryFn: async ({ signal }) => {
      const { from, to } = getSnapshotWindow();
      const rows = await getRates({ base, quotes, from, to }, signal);
      return computeSnapshots(rows, quotes);
    },
    staleTime: HOUR,
    retry: shouldRetry,
  });

export const seriesQuery = (base: string, quote: string, range: Range) =>
  queryOptions({
    queryKey: fxKeys.series(base, quote, range),
    queryFn: async ({ signal }) => {
      const { from, to, group, tail } = getRangeWindow(range);
      const rows = await getRates(
        { base, quotes: [quote], from, to, group },
        signal,
      );
      return applyTail(toSeries(rows, quote), tail);
    },
    // Past dates never change, so longer ranges can stay fresh for longer.
    staleTime: range === "1D" || range === "1W" ? HOUR : 6 * HOUR,
    retry: shouldRetry,
  });

export const useCurrencies = () => useQuery(currenciesQuery());

export const useRate = (base: string, quote: string) =>
  useQuery({ ...rateQuery(base, quote), enabled: Boolean(base && quote) });

export const useSnapshots = (base: string, quotes: string[]) =>
  useQuery({
    ...snapshotsQuery(base, quotes),
    enabled: Boolean(base) && quotes.length > 0,
  });

export const useSeries = (base: string, quote: string, range: Range) =>
  useQuery({
    ...seriesQuery(base, quote, range),
    enabled: Boolean(base && quote),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[2] === base &&
      previousQuery?.queryKey[3] === quote
        ? previousData
        : undefined,
  });

export const useRangeMetrics = (base: string, quote: string, range: Range) =>
  useQuery({
    ...seriesQuery(base, quote, range),
    enabled: Boolean(base && quote),
    select: computeMetrics,
  });

export const usePairSnapshots = (pairs: CurrencyPair[]) => {
  const groups = groupByBase(pairs);

  return useQueries({
    queries: Object.entries(groups).map(([base, quotes]) =>
      snapshotsQuery(base, quotes),
    ),
    combine: (results) => {
      const flat = results.flatMap((r) => r.data ?? []);
      const error = results.find((r) => r.error)?.error ?? null;
      const isPending = results.some((r) => r.isPending);

      const bySnapshotKey = new Map(flat.map((s) => [createPairKey(s), s]));

      const data = pairs
        .map((pair) => bySnapshotKey.get(createPairKey(pair)))
        .filter((s) => s !== undefined);

      return { data, isPending, error };
    },
  });
};
