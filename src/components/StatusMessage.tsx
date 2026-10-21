import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

type StatusMessageProps = {
  children: ReactNode;
};

export const StatusMessage = ({ children }: StatusMessageProps) => (
  <p className={styles.message}>{children}</p>
);