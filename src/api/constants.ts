import type { View } from "./types";

export const VIEW_ITEMS: { label: string; value: View }[] = [
  { label: "History", value: "history" },
  { label: "Compare", value: "compare" },
  { label: "Favourites", value: "favourites" },
  { label: "Log", value: "log" },
];

export const isView = (value: unknown): value is View =>
  VIEW_ITEMS.some((item) => item.value === value);