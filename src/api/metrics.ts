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

export function computeSnapshots(rows: RateRows, quotes: string[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  for (const raw of quotes) {
    const quote = raw.toUpperCase();
    const series = toSeries(rows, quote);
    const latest = series[series.length - 1];
    if (!latest) continue;
    const prev = series.length > 1 ? series[series.length - 2] : null;
    const change = prev ? latest.rate - prev.rate : null;
    snapshots.push({
      base: rows.find((r) => r.quote === quote)?.base ?? "",
      quote,
      rate: latest.rate,
      date: latest.date,
      previousRate: prev?.rate ?? null,
      previousDate: prev?.date ?? null,
      change,
      changePct: prev && change !== null ? (change / prev.rate) * 100 : null,
    });
  }
  return snapshots;
}

export const convert = (amount: number, rate: number): number => amount * rate;
