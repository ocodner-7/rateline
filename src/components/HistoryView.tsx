import { useState } from "react";
import {
  changeFormatter,
  formatRate,
  getDirection,
  pctFormatter,
} from "../api/format";
import { useRangeMetrics } from "../api/queries";
import { RANGES, type Range } from "../api/ranges";
import type { MetricKey } from "../api/types";
import styles from "./HistoryView.module.css";
import { RangeMetricCard } from "./RangeMetricCard";
import { RangeSelector } from "./RangeSelector";
import { TrendArrow } from "./TrendArrow";
import { useMemo } from "react";
import { useSeries } from "../api/queries";
import { ChartCard } from "./ChartCard";
import type { PricePoint } from "./PriceChart";

type HistoryProps = {
  base: string;
  quote: string;
};

const LABELS: Record<MetricKey, string> = {
  open: "OPEN",
  last: "LAST",
  change: "CHANGE",
  changePct: "% CHANGE",
};

const NO_VALUE = "--";

export const HistoryView = ({ base, quote }: HistoryProps) => {
  const [range, setRange] = useState<Range>("1M");

  const { data: metrics } = useRangeMetrics(base, quote, range);
  const direction = metrics ? getDirection(metrics.changePct) : undefined;

  const {
    data: series,
    isError: seriesError,
    isPending: seriesPending,
  } = useSeries(base, quote, range);

  const points = useMemo<PricePoint[]>(
    () =>
      (series ?? []).map((point) => ({
        time: new Date(point.date).getTime(),
        value: point.rate,
      })),
    [series],
  );

  let chartStatus: "loading" | "error" | "ready" = "ready";
  if (seriesError) chartStatus = "error";
  else if (seriesPending) chartStatus = "loading";

  return (
    <div>
      <div className={styles.rangeMetrics}>
        <RangeMetricCard label={LABELS.open}>
          {metrics ? formatRate(metrics.open) : NO_VALUE}
        </RangeMetricCard>
        <RangeMetricCard label={LABELS.last}>
          {metrics ? formatRate(metrics.last) : NO_VALUE}
        </RangeMetricCard>
        <RangeMetricCard direction={direction} label={LABELS.change}>
          {metrics ? changeFormatter.format(metrics.change) : NO_VALUE}
        </RangeMetricCard>
        <RangeMetricCard direction={direction} label={LABELS.changePct}>
          {metrics ? (
            <>
              {direction && <TrendArrow direction={direction} />}
              {pctFormatter.format(metrics.changePct)}%
            </>
          ) : (
            NO_VALUE
          )}
        </RangeMetricCard>
      </div>

      <RangeSelector ranges={RANGES} value={range} onChange={setRange} />

      <ChartCard
        base={base}
        quote={quote}
        points={points}
        status={chartStatus}
      />
    </div>
  );
};
