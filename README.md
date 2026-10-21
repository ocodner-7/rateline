# Rateline

A currency rate checker. Convert between currencies, see how a pair has moved over time, compare one currency against a handful of others, and keep a list of favourite pairs and a log of conversions.

**Live site:** <LIVE_URL>

![Rateline on mobile and desktop](./docs/screenshot.png)

Built from a Frontend Mentor design challenge. The design covers mobile only, so the tablet (768px) and desktop (1024px) layouts are my own.

## Features

- **Converter:** send and receive boxes, a swap button, and a rate line showing the current rate and its date.
- **Currency picker:** searchable, with a short "Popular" group, flags, and a globe icon for currencies without a flag. On mobile the menu opens centred under the whole converter; on larger screens it opens under the trigger.
- **Ticker:** a looping marquee of major pairs with the rate and daily change. It pauses on hover and respects `prefers-reduced-motion`.
- **History:** a price chart for the selected pair over selectable ranges.
- **Compare:** the selected amount converted into a fixed set of currencies (GBP, JPY, CHF, CAD, AUD, INR, CNY, BDT).
- **Favourites:** save pairs and see their current rate and change. Stored in `localStorage`.
- **Conversion log:** record a conversion with the rate and result at the time. Stored in `localStorage`.
- **Responsive:** a select-based view switcher on mobile that becomes tabs from 768px.

## Tech stack

- Vite, React, TypeScript (strict)
- TanStack Query v5 for server state
- Zod 4 to validate API responses
- Base UI (`@base-ui/react`) for the select, tabs and combobox
- Highcharts for the price chart
- CSS Modules with design tokens, no CSS framework
- lucide-react for icons
- Vitest for tests
- Deployed on Vercel

## Data

Rates come from the [Frankfurter](https://frankfurter.dev) API (v2), which aggregates central bank data. These are end of day reference rates, not live ticks.

## Decisions worth explaining

- **One request per base currency.** The API takes one base per request, but the ticker and favourites show pairs with different bases. `groupByBase` groups the pairs, one query runs per base, and the results are flattened back into the original order.
- **Server state stays in the query cache.** Components read it where it is used. Client state (amount, from, to) is lifted only as far as the components that share it.
- **The converted amount is derived, not stored.** The Receive value is calculated during render from the amount and the cached rate, so it can never go out of sync.
- **Same-currency pairs skip the network.** The rate is short-circuited to 1 and the query is disabled, so there is no failing request or retry cycle.
- **The chart is an adapter.** `PriceChart` is the only file that imports Highcharts and takes plain `{ time, value }` points. Tick and scale logic lives in pure, tested functions, so swapping the chart library is a one-file change.
- **Highcharts is lazy loaded.** The History view is split into its own chunk, so the converter does not pay for the chart library.
- **Logging stores the result.** A log entry keeps the rate and result at the time, so history does not change when rates move.
- **Local storage through `useSyncExternalStore`.** The store returns a stable snapshot reference so components only re-render when the data actually changes.
- **Accessibility.** Colour is never the only up or down signal (arrows and signed percentages too), decorative SVGs are hidden from screen readers, and Base UI handles keyboard and focus behaviour for the interactive controls.

## Getting started

Requires Node 20 or later.

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # type check and production build
npm run preview    # serve the last build locally (run build first)
npm run lint
npx vitest         # run the tests
```

`npm run preview` serves whatever is in `dist`, so rebuild before previewing changes.

## Known limitations

- Rates are end of day, so the daily change is not a live figure.
- The Frankfurter API is free and can occasionally be slow. Requests retry, but there is no dedicated timeout message yet.
- Per-currency decimal places are applied in the conversion log and compare views, but the chart axis uses four decimals for every pair.

## Credits

- Design challenge by [Frontend Mentor](https://www.frontendmentor.io).
- Exchange rate data from [Frankfurter](https://frankfurter.dev).
- Charts by [Highcharts](https://www.highcharts.com). The Highcharts credit is kept visible on the chart. Highcharts is licensed separately, see [highcharts.com/license](https://www.highcharts.com/license).
- Icons by [Lucide](https://lucide.dev). Flag images are from the challenge starter files.