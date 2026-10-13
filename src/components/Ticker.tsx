import { getErrorMessage } from "../api/api";
import { formatChangePct, formatRate, getDirection } from "../api/format";
import { createPairKey } from "../api/pairs";
import { usePairSnapshots } from "../api/queries";
import type { CurrencyPair } from "../api/types";
import styles from "./Ticker.module.css";
import { TrendArrow } from "./TrendArrow";

type TickerProps = { pairs: CurrencyPair[] };

export const Ticker = ({ pairs }: TickerProps) => {
  const { data, isPending, error } = usePairSnapshots(pairs);

  if (isPending) return <p>Loading...</p>;

  if (error) return <p>{getErrorMessage(error)}</p>;

  const items = data.map((snapshot) => {
    const key = createPairKey(snapshot);
    const { changePct } = snapshot;

    return (
      <li key={key} className={styles.item}>
        <span className={styles.pair}>{key}</span>
        <span className={styles.rate}>{formatRate(snapshot.rate)}</span>
        {typeof changePct === "number" && (
          <span
            className={`${styles.change} ${styles[getDirection(changePct)]}`}
          >
            <TrendArrow direction={getDirection(changePct)} />
            {formatChangePct(changePct)}
          </span>
        )}
      </li>
    );
  });

  return (
    <div className={styles.strip}>
      <span className={styles.label}>Live Markets</span>
      <div className={styles.track}>
      <ul className={styles.ticker}>
        {items}
      </ul>
      <ul className={`${styles.ticker} ${styles.clone}`} aria-hidden="true">
        {items}
      </ul>
      </div>
    </div>
  );
};
