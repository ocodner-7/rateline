import styles from "../components/Header.module.css";
import { useCurrencies } from "../api/queries";

interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {

  const { data: currencyData } = useCurrencies();
  const currencyCount = currencyData?.length;

  return (
    <header className={styles.header}>
      <span className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true">
          <svg
            className={styles.logoGlyph}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,17 8,11 13,15 22,5" />
          </svg>
        </span>
        {children}
      </span>

      <p className={styles.meta}>
        <span>{currencyCount ?? "—"} currencies</span>
        <span>EOD</span>
        <span>CENTRAL BANK DATA</span>
      </p>
    </header>
  );
};
