import type { Group } from "./types";

export const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;
export type Range = (typeof RANGES)[number];

interface RangeOptions {
  days: number;
  group?: Group;
  tail?: number;
}

interface RangeWindow {
  from: string;
  to: string;
  group?: Group;
  tail?: number;
}

const toDateString = (d: Date): string => {
  return d.toISOString().slice(0, 10);
};

const RANGE_CONFIG: Record<Range, RangeOptions> = {
  "1D": { days: 7, tail: 2 },
  "1W": { days: 7 },
  "1M": { days: 30 },
  "3M": { days: 90 },
  "1Y": { days: 365 },
  "5Y": { days: 5 * 365, group: "week" },
};

const offsetDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - days);
  return d;
};

export const getRangeWindow = (
  range: Range,
  today = new Date(),
): RangeWindow => {
  const { days, group, tail } = RANGE_CONFIG[range];
  const start = new Date(today);
  return {
    from: toDateString(offsetDays(start, days)),
    to: toDateString(start),
    group,
    tail,
  };
};

export const getSnapshotWindow = (today = new Date()) => {
  return { from: toDateString(offsetDays(today, 7)), to: toDateString(today) };
};
