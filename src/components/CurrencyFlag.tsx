import { getFlagUrl } from "../api/flags";
import styles from "./CurrencyFlag.module.css";

interface CurrencyFlagProps {
  code: string;
}

export const CurrencyFlag = ({ code }: CurrencyFlagProps) => {
  const url = getFlagUrl(code);
    
  return (
    <>
      {url ? (
        <img src={url} alt="" className={styles.flag} />
      ) : (
        <span className={styles.flagFallback} aria-hidden="true" />
      )}
    </>
  );
};
