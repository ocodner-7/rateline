import { afterEach, expect, it, vi } from "vitest";
import { getRate, getRates } from "../src/api/api";

afterEach(() => vi.unstubAllGlobals());

it("throws ApiError with the API message", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ message: "invalid currency: ABC" }), {
          status: 422,
        }),
      ),
  );
  await expect(getRate("GBP", "ABC")).rejects.toMatchObject({
    status: 422,
    message: "invalid currency: ABC",
  });
});

it("normalises and dedupes quote codes", async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify([]), { status: 200 }), // empty array passes the schema
  );
  vi.stubGlobal("fetch", fetchMock);

  await getRates({ base: "gbp", quotes: ["usd", "USD", "eur"] });

  const url = new URL(String(fetchMock.mock.calls[0][0]));
  expect(url.searchParams.get("quotes")).toBe("USD,EUR");
});

it("falls back to a default message when the error body isn't JSON", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("Bad Gateway", { status: 502 })),
  );
  await expect(getRate("GBP", "USD")).rejects.toMatchObject({
    status: 502,
    message: "Request failed (502)",
  });
});