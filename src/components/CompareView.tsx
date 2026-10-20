import { useMemo } from "react";
import { getErrorMessage } from "../api/api";
import { getCompareQuotes } from "../api/compare";
import { useFavourites } from "../api/favourites";
import { formatAmount, formatRate } from "../api/format";
import { convert, parseAmount } from "../api/metrics";
import { formatMoney } from "../api/money";
import { createPairKey } from "../api/pairs";
import { useCurrencies, usePairSnapshots } from "../api/queries";
import type { CurrencyPair } from "../api/types";
import styles from "./CompareView.module.css";
import { CurrencyFlag } from "./CurrencyFlag";
import { FavouriteToggle } from "./FavouriteToggle";
import { PairList, PairRow } from "./PairRow";

const NO_VALUE = "--";

type CompareItemProps = {
  base: string;
  quote: string;
  name: string;
  rate: number;
  converted: number | null;
  isFavourite: boolean;
  onToggle: (pair: CurrencyPair) => void;
};

const CompareItem = ({ base, quote, name, rate, converted, isFavourite, onToggle }: CompareItemProps) => (
  <PairRow
    leading={
      <div className={styles.currency}>
        <CurrencyFlag code={quote} />
        <div className={styles.names}>
          <span className={styles.code}>{quote}</span>
          <span className={styles.name}>{name}</span>
        </div>
      </div>
    }
    primary={converted === null ? NO_VALUE : formatMoney(converted, quote)}
    secondary={`@ ${formatRate(rate)}`}
    action={
      <FavouriteToggle
        isFavourite={isFavourite}
        label={`Favourite ${base} to ${quote}`}
        onToggle={() => onToggle({ base, quote })}
      />
    }
  />
);

type CompareViewProps = {
  base: string;
  amount: string;
};

export const CompareView = ({ base, amount }: CompareViewProps) => {
  const pairs = useMemo<CurrencyPair[]>(
    () => getCompareQuotes(base).map((quote) => ({ base, quote })),
    [base],
  );
  const { data, isPending, error } = usePairSnapshots(pairs);
  const { data: currencies } = useCurrencies();
  const { favourites, toggle } = useFavourites();

  const names = useMemo(
    () => new Map(currencies?.map((currency) => [currency.iso_code, currency.name] as const) ?? []),
    [currencies],
  );
  const favouriteKeys = useMemo(
    () => new Set(favourites.map((pair) => createPairKey(pair))),
    [favourites],
  );

  const parsed = parseAmount(amount);
  const validAmount = typeof parsed === "number" && parsed > 0 ? parsed : null;

  if (isPending) return <p>Loading comparison…</p>;
  if (error) return <p>{getErrorMessage(error)}</p>;

  return (
    <section className={styles.compare}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.label}>Multi-currency</span>{" "}
          <span className={styles.amount}>{validAmount === null ? base : `${formatAmount(validAmount.toString())} from ${base}`}</span>
        </h3>
        <p className={styles.count}>{data.length} pairs</p>
      </header>

      <PairList>
        {data.map((snapshot) => (
          <CompareItem
            key={createPairKey(snapshot)}
            base={snapshot.base}
            quote={snapshot.quote}
            name={names.get(snapshot.quote) ?? ""}
            rate={snapshot.rate}
            converted={validAmount === null ? null : convert(validAmount, snapshot.rate)}
            isFavourite={favouriteKeys.has(createPairKey(snapshot))}
            onToggle={toggle}
          />
        ))}
      </PairList>
    </section>
  );
};