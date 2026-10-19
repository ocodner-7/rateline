const MINUTE = 60_000;
const HOUR = 3_600_000;

const monthDay = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const monthDayYear = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// "NOW", "20M", "4H", then a date once it's a day old ("13 May", or "13 May 2025" from another year).
export const formatLoggedAt = (iso: string, now: number): string => {
  const then = new Date(iso);
  const elapsed = now - then.getTime();
  if (Number.isNaN(elapsed)) return "";
  if (elapsed < MINUTE) return "NOW";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}M`;
  if (elapsed < 24 * HOUR) return `${Math.floor(elapsed / HOUR)}H`;
  const sameYear = then.getFullYear() === new Date(now).getFullYear();
  return (sameYear ? monthDay : monthDayYear).format(then);
};