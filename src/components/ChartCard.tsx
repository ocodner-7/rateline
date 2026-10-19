import { formatRate } from "../api/format";
import styles from "./ChartCard.module.css";
import { PriceChart, type PricePoint } from "./PriceChart";

type ChartCardProps = {
  base: string;
  quote: string;
  points: PricePoint[];
  status: "loading" | "error" | "ready";
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const ChartCard = ({ base, quote, points, status }: ChartCardProps) => {
  const pair = `${base}/${quote}`;
  const last = points.at(-1);
  const hasChart = status === "ready" && points.length >= 2;

  let body;
  if (hasChart) {
    body = <PriceChart points={points} ariaLabel={`${pair} exchange rate over the selected range`} />;
  } else {
    let message = "No rates for this range";
    if (status === "loading") message = "Loading chart…";
    else if (status === "error") message = "Couldn't load the chart";
    body = <p className={styles.state}>{message}</p>;
  }

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.pair}>{pair}</h3>
        {hasChart && last && (
          <p className={styles.meta}>
            {formatRate(last.value)} · {dateFormatter.format(last.time)}
          </p>
        )}
      </header>
      {body}
    </section>
  );
};