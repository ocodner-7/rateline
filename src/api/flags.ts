import { normaliseCode } from "./api";

const flagModules = import.meta.glob<string>("../assets/images/flags/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

// "../assets/flags/us.webp" -> "us"
const getCountryCodeFromPath = (path: string): string =>
  (path.split("/").pop() ?? "").replace(".webp", "");

const flagUrls = new Map<string, string>(
  Object.entries(flagModules).map(([path, url]): [string, string] => [
    getCountryCodeFromPath(path),
    url,
  ]),
);

export const getFlagUrl = (currencyCode: string): string | undefined => {
  const countryCode = normaliseCode(currencyCode).toLowerCase().slice(0, 2);
  return flagUrls.get(countryCode);
};