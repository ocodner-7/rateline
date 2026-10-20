import type { ReactNode } from "react";
import styles from "./PairRow.module.css";

type PairListProps = { children: ReactNode };

export const PairList = ({ children }: PairListProps) => (
  <ul className={styles.list}>{children}</ul>
);

type PairRowProps = {
  leading: ReactNode;
  primary: ReactNode;
  secondary: ReactNode;
  action: ReactNode;
};

export const PairRow = ({ leading, primary, secondary, action }: PairRowProps) => (
  <li className={styles.row}>
    <div className={styles.main}>
      <div className={styles.leading}>{leading}</div>
      <div className={styles.figures}>
        <span className={styles.primary}>{primary}</span>
        <span className={styles.secondary}>{secondary}</span>
      </div>
    </div>
    {action}
  </li>
);