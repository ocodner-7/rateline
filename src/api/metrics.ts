import type { RangeMetrics, RateRows, SeriesPoint, Snapshot } from "./types";

export const toSeries = (rows: RateRows, quote: string): SeriesPoint[] => {
  const q = quote.toUpperCase();

  return rows
    .filter((r) => r.quote === q)
    .map(({ date, rate }) => ({ date, rate }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const applyTail = <T>(points: T[], tail?: number): T[] => {
  return tail === undefined ? points : points.slice(-tail);
};

export const computeMetrics = (points: SeriesPoint[]): RangeMetrics | null => {
  if (points.length === 0) return null;

  const open = points[0].rate;
  const last = points[points.length - 1].rate;
  const change = last - open;
  const changePct = open === 0 ? 0 : (change / open) * 100;

  return { open, last, change, changePct };
};

export const calculatePct = (a: number, b: number) => (a / b) * 100;

export const computeSnapshots = (
  rows: RateRows,
  quotes: string[],
): Snapshot[] => {
  const snapshots: Snapshot[] = [];
  const base = rows[0]?.base ?? "";

  for (const raw of quotes) {
    const quote = raw.toUpperCase();
    const series = toSeries(rows, quote);
    const latest = series[series.length - 1];

    if (!latest) continue;

    const previous = series.length > 1 ? series[series.length - 2] : null;

    const change = previous ? latest.rate - previous.rate : null;

    snapshots.push({
      base,
      quote,
      change,
      changePct:
        previous && change !== null
          ? calculatePct(change, previous.rate)
          : null,
      previousDate: previous ? previous.date : null,
      previousRate: previous ? previous.rate : null,
      date: latest.date,
      rate: latest.rate,
    });
  }

  return snapshots;
};

export const convert = (amount: number, rate: number): number => amount * rate;