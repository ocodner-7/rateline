import styles from "./CountBadge.module.css";

type CountBadgeProps = {
  count: number | undefined;
};

export const CountBadge = ({ count }: CountBadgeProps) => {
  if (count === undefined || count <= 0) return null;
  return <span className={styles.badge}>{count}</span>;
};