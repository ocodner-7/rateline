import type { YTicks } from "./types";

export type YAxisScale = {
  min: number;
  max: number;
  ticks: [number, number, number];
};

export const getYTicks = (values: number[]): YTicks | null => {
  if (values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const mid = (min + max) / 2;

  return { max, mid, min };
};

// The axis sits exactly on the lowest and highest values (the design has the
// line touching the top and bottom grid lines). A flat series gets a small
// artificial range so the three ticks stay distinct.
export const getYAxisScale = (values: number[]): YAxisScale | null => {
  const ticks = getYTicks(values);
  if (ticks === null) return null;

  if (ticks.min === ticks.max) {
    const padding = Math.abs(ticks.min) * 0.001 || 0.001;
    return {
      min: ticks.min - padding,
      max: ticks.max + padding,
      ticks: [ticks.min - padding, ticks.mid, ticks.max + padding],
    };
  }

  return {
    min: ticks.min,
    max: ticks.max,
    ticks: [ticks.min, ticks.mid, ticks.max],
  };
};

// The three date labels in the design: first, middle and last.
export const getXTicks = (times: number[]): number[] => {
  if (times.length === 0) return [];
  const first = times[0];
  const last = times[times.length - 1];
  return first === last ? [first] : [first, (first + last) / 2, last];
};

// Highcharts gradient stops need real colour strings, not CSS variables,
// so this turns a hex token value into rgba. Non-hex colours pass through unchanged.
export const withAlpha = (color: string, alpha: number): string => {
  const hex = color.trim().replace(/^#/, "");
  const full =
    hex.length === 3
      ? [...hex].map((character) => character + character).join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return color;
  const red = parseInt(full.slice(0, 2), 16);
  const green = parseInt(full.slice(2, 4), 16);
  const blue = parseInt(full.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};