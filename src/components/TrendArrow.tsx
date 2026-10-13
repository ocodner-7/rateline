import type { ArrowDirection } from "../api/types";
import styles from "./TrendArrow.module.css";

type TrendArrowProps = { direction: ArrowDirection };

export function TrendArrow({ direction }: TrendArrowProps) {
  if (direction === "flat") return null;

  const className = direction === "down" ? `${styles.arrow} ${styles.down}` : styles.arrow;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}