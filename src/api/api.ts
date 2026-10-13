import type { ZodType } from "zod";
import {
  ApiErrorBodySchema,
  CurrenciesSchema,
  RateRowSchema,
  RateRowsSchema,
} from "../schemas";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2";

type Params = Record<string, string | undefined>;

const request = async <T>(
  path: string,
  schema: ZodType<T>,
  params: Params = {},
  signal?: AbortSignal,
): Promise<T> => {
  const url = new URL(`${FRANKFURTER_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

 if (!res.ok) {
  const json = await res.json().catch(() => null);
  const body = ApiErrorBodySchema.safeParse(json);
  const message = body.success
    ? body.data.message
    : `Request failed (${res.status})`;

  throw new ApiError(res.status, message);
}

  return schema.parse(await res.json());
};

import type { Currencies, Group, RateRow, RateRows } from "./types";

export const normaliseCode = (code: string) => code.trim().toUpperCase();

export const getRate = async (
  base: string,
  quote: string,
  signal?: AbortSignal,
): Promise<RateRow> => {
  return request(
    `/rate/${encodeURIComponent(normaliseCode(base))}/${encodeURIComponent(normaliseCode(quote))}`,
    RateRowSchema,
    {},
    signal,
  );
};

export const getCurrencies = async (
  signal?: AbortSignal,
): Promise<Currencies> => {
  return request("/currencies", CurrenciesSchema, {}, signal);
};

interface RatesOptions {
  base: string;
  quotes: string[];
  from?: string;
  to?: string;
  group?: Group;
}

export const getRates = async (
  options: RatesOptions,
  signal?: AbortSignal,
): Promise<RateRows> => {
  const normalisedQuotes = Array.from(
    new Set(options.quotes.map(normaliseCode)),
  ).join(",");

  const params = {
    base: normaliseCode(options.base),
    quotes: normalisedQuotes,
    from: options.from,
    to: options.to,
    group: options.group,
  };

  return request("/rates", RateRowsSchema, params, signal);
};

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";