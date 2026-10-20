import { ArrowUpDown, Check, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { formatRate } from "../api/format";
import { convert, parseAmount } from "../api/metrics";
import { useRate } from "../api/queries";
import { AmountInput } from "./AmountInput";
import { CurrencyPicker } from "./CurrencyPicker";
import styles from "./RateChecker.module.css";
import { Button as CustomButton } from "./Button";
import { useFavourites } from "../api/favourites";
import type { CurrencyPair } from "../api/types";
import { useConversionLog } from "../api/conversionLog";
import { getErrorMessage } from "../api/api";

interface RateCheckerProps {
  title: string;
  from: string;
  to: string;
  amount: string;
  setAmount: (amount: string) => void;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
}

// Fixed 2 decimals for now. Per-currency decimals are in the backlog.
const receiveFormatter = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const RateChecker = ({ title = "CHECK THE RATE", from, to, amount, setAmount, onFromChange, onToChange }: RateCheckerProps) => {
  const [justLogged, setJustLogged] = useState(false);

  const { data, error } = useRate(from, from === to ? "" : to);
  const rate = from === to ? 1 : data?.rate;
  const parsed = parseAmount(amount);
  const received =
    typeof parsed === "number" && rate !== undefined
      ? convert(parsed, rate)
      : 0;

  const swap = () => {
    onFromChange(to);
    onToChange(from);
  };

  const { isFavourite, toggle } = useFavourites();

  const pair: CurrencyPair = { base: from, quote: to };

  const formattedReceived = receiveFormatter.format(received);

  const conversionLog = useConversionLog();

  const canLog = typeof parsed === "number" && parsed > 0 && rate !== undefined;

  let rateLine: string;

  if (rate !== undefined) {
    rateLine = `1 ${from} = ${formatRate(rate)} ${to}`;
  } else if (error) {
    rateLine = getErrorMessage(error);
  } else {
    rateLine = "Fetching rate…";
  }

  useEffect(() => {
    if (!justLogged) return;
    const timer = setTimeout(() => setJustLogged(false), 1500);
    return () => clearTimeout(timer);
  }, [justLogged]);

  const handleLog = () => {
    console.log("log clicked", { canLog, parsed, rate });
    if (!canLog) return;
    conversionLog.add({
      base: from,
      quote: to,
      amount: parsed,
      rate,
      result: received,
    });
    setJustLogged(true);
  };

  return (
    <>
      <p className="title">{title}</p>
      <div className={styles.box}>
        <div className={styles.field}>
          <AmountInput
            id="send"
            label="SEND"
            value={amount}
            onChange={setAmount}
          />
          <CurrencyPicker value={from} onChange={onFromChange} />
        </div>

        <button
          type="button"
          className={styles.swap}
          onClick={swap}
          aria-label="Swap currencies"
        >
          <ArrowUpDown className={styles.swapIcon} aria-hidden="true" />
        </button>

        <div className={styles.field}>
          <div className={styles.receive}>
            <span className={styles.receiveLabel}>RECEIVE</span>
            <output
              htmlFor="send"
              aria-live="polite"
              className={styles.receiveValue}
              data-long={formattedReceived.length > 12 ? "" : undefined}
            >
              {formattedReceived}
            </output>
          </div>
          <CurrencyPicker value={to} onChange={onToChange} />
        </div>

        <p className={styles.rateLine} aria-live="polite">
          {rateLine}
        </p>

        <div className={styles.controls}>
          <CustomButton
            className={styles.faveButton}
            variant={isFavourite(pair) ? "primary" : "base"}
            onClick={() => toggle(pair)}
          >
            <StarIcon className={styles.btnIcon} size={16} />
            {isFavourite(pair) ? "FAVOURITED" : "FAVOURITE"}
          </CustomButton>
          <CustomButton
            onClick={handleLog}
            variant="secondary"
            disabled={!canLog}
          >
            {justLogged ? (
              <div className={styles.justLogged}>
                <Check className={styles.logIcon} aria-hidden="true" />
                Logged
              </div>
            ) : (
              "LOG CONVERSION"
            )}
          </CustomButton>
        </div>
      </div>
    </>
  );
};
