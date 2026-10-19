import type { ArrowDirection } from "../api/types";
import styles from "./RangeMetricsCard.module.css";

type RangeMetricCardProps = {
  label: string;
  children: React.ReactNode;
  direction?: ArrowDirection; // only for the change cards, to colour the value
};

export const RangeMetricCard = ({
  label,
  children,
  direction,
}: RangeMetricCardProps) => {
  return (
    <>
      <div className={styles.root}>
        <p className={styles.label}>{label}</p>

        <span className={`${styles.value} ${direction ? styles[direction] : ""}`}>
          {children}
        </span>
      </div>
    </>
  );
};
