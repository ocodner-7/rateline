import Highcharts from "highcharts";
import { useEffect, useMemo, useRef } from "react";
import { getXTickCount, getXTicks, getYAxisScale, withAlpha } from "../api/chart";

export type PricePoint = { time: number; value: number };
type PriceChartProps = { points: PricePoint[]; ariaLabel: string };

const LABEL_GUTTER = 46;
const CHART_HEIGHT = 310;

const readToken = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

export const PriceChart = ({ points, ariaLabel }: PriceChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo<Highcharts.Options | null>(() => {
    const scale = getYAxisScale(points.map((point) => point.value));
    if (scale === null) return null;

    const times = points.map((point) => point.time);
    const lime = readToken("--lime-500", "#c6f432");
    const muted = readToken("--neutral-200", "#9a9a9a");
    const grid = readToken("--neutral-400", "#3a3a3a");
    const surface = readToken("--neutral-500", "#1f1f1f");
    const text = readToken("--neutral-50", "#ffffff");
    const xLabelStyle = { color: muted, fontSize: "11px", textOverflow: "none" };
    const yLabelStyle = { color: muted, fontSize: "10px", textOverflow: "none" };

    return {
      chart: {
        backgroundColor: "transparent",
        height: CHART_HEIGHT,
        marginLeft: LABEL_GUTTER,
        spacing: [12, 0, 18, 0],
        style: { fontFamily: "inherit" },
      },
      title: { text: undefined },
      credits: { style: { color: muted, fontSize: "10px" } },
      legend: { enabled: false },
      xAxis: {
        type: "datetime",
        tickPositioner() {
          return getXTicks(times, getXTickCount(this.chart.plotWidth));
        },
        lineWidth: 0,
        tickLength: 0,
        labels: { format: "{value:%b %e}", overflow: "justify", style: xLabelStyle },
      },
      yAxis: {
        title: { text: undefined },
        min: scale.min,
        max: scale.max,
        tickPositions: [...scale.ticks],
        gridLineWidth: 1,
        gridLineDashStyle: "Dash",
        gridLineColor: grid,
        labels: { align: "left", x: -LABEL_GUTTER, format: "{value:.4f}", style: yLabelStyle },
      },
      tooltip: {
        xDateFormat: "%b %e, %Y",
        headerFormat: '<span style="font-size:11px">{point.key}</span><br/>',
        pointFormat: "<b>{point.y:.4f}</b>",
        backgroundColor: surface,
        borderColor: grid,
        borderRadius: 8,
        shadow: false,
        style: { color: text },
      },
      series: [
        {
          type: "area",
          data: points.map((point): [number, number] => [point.time, point.value]),
          color: lime,
          lineWidth: 2,
          threshold: null,
          clip: false,
          marker: {
            enabled: false,
            states: { hover: { enabled: true, radius: 4, fillColor: lime, lineColor: surface } },
          },
          states: { hover: { lineWidth: 2 } },
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, withAlpha(lime, 0.5)],
              [1, withAlpha(lime, 0)],
            ],
          },
        },
      ],
    };
  }, [points]);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || options === null) return;
    const chart = Highcharts.chart(container, options);
    return () => chart.destroy();
  }, [options]);

  if (options === null) return null;

  return (
    <div role="img" aria-label={ariaLabel}>
      <div ref={containerRef} style={{ minHeight: CHART_HEIGHT }} />
    </div>
  );
};