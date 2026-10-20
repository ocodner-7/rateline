import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useConversionLog } from "../api/conversionLog";
import { formatMoney } from "../api/money";
import { formatLoggedAt } from "../api/time";
import type { LogEntry } from "../api/types";
import { Button } from "./Button";
import styles from "./ConversionLogView.module.css";

const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};

type LogItemProps = {
  entry: LogEntry;
  now: number;
  onRemove: (id: string) => void;
};

const LogItem = ({ entry, now, onRemove }: LogItemProps) => {
  const when = formatLoggedAt(entry.loggedAt, now);

  return (
    <li className={styles.item}>
      <div className={styles.main}>
        <div className={styles.meta}>
          <span className={styles.when}>{when}</span>
          <span className={styles.pair}>
            {entry.base} → {entry.quote}
          </span>
        </div>
        <div className={styles.figures}>
          <span className={styles.amount}>{formatMoney(entry.amount, entry.base)}</span>
          <span className={styles.result}>{formatMoney(entry.result, entry.quote)}</span>
        </div>
      </div>
      <button
        type="button"
        className={styles.delete}
        onClick={() => onRemove(entry.id)}
        aria-label={`Delete ${entry.base} to ${entry.quote} conversion from ${when}`}
      >
        <Trash2 className={styles.icon} aria-hidden="true" />
      </button>
    </li>
  );
};

export const ConversionLogView = () => {
  const { entries, remove, clear } = useConversionLog();
  const now = useNow(60_000);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [entries],
  );

  return (
    <section className={styles.log}>
      <h3 className={styles.title}>Conversion log</h3>
      <div className={styles.bar}>
        <p className={styles.count}>{entries.length} logged</p>
        {entries.length > 0 && (
          <Button variant="base" onClick={clear}>
            CLEAR ALL
          </Button>
        )}
      </div>
      {sorted.length === 0 ? (
        <p className={styles.empty}>No conversions logged yet. Use “Log conversion” above to add one.</p>
      ) : (
        <ul className={styles.list}>
          {sorted.map((entry) => (
            <LogItem key={entry.id} entry={entry} now={now} onRemove={remove} />
          ))}
        </ul>
      )}
    </section>
  );
};