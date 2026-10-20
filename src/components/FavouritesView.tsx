import { ArrowRight } from "lucide-react";
import { getErrorMessage } from "../api/api";
import { useFavourites } from "../api/favourites";
import { formatChangePct, formatRate, getDirection } from "../api/format";
import { createPairKey } from "../api/pairs";
import { usePairSnapshots } from "../api/queries";
import type { CurrencyPair } from "../api/types";
import { FavouriteToggle } from "./FavouriteToggle";
import styles from "./FavouritesView.module.css";
import { PairList, PairRow } from "./PairRow";
import { TrendArrow } from "./TrendArrow";

const NO_VALUE = "--";

type FavouritesItemProps = {
  base: string;
  quote: string;
  rate: number;
  changePct: number | null | undefined;
  onToggle: (pair: CurrencyPair) => void;
};

const FavouritesItem = ({
  base,
  quote,
  rate,
  changePct,
  onToggle,
}: FavouritesItemProps) => {
  const hasChange = typeof changePct === "number";
  const direction = hasChange ? getDirection(changePct) : undefined;

  return (
    <PairRow
      leading={
        <span className={styles.pair}>
          {base}
            <ArrowRight size={12} />
          {quote}
        </span>
      }
      primary={formatRate(rate)}
      secondary={
        <span className={styles.changePct} data-direction={direction}>
          {direction && <TrendArrow direction={direction} />}
          {hasChange ? formatChangePct(changePct) : NO_VALUE}
        </span>
      }
      action={
        <FavouriteToggle
          isFavourite
          label={`Favourite ${base} to ${quote}`}
          onToggle={() => onToggle({ base, quote })}
        />
      }
    />
  );
};

export const FavouritesView = () => {
  const { favourites, toggle } = useFavourites();
  const { data, isPending, error } = usePairSnapshots(favourites);

  if (favourites.length === 0) return <p>No favourites yet.</p>;
  if (isPending) return <p>Loading favourites…</p>;
  if (error) return <p>{getErrorMessage(error)}</p>;

  return (
    <section className={styles.favourites}>
      <div className={styles.bar}>
        <h3 className={styles.title}>Pinned pairs</h3>
        <span className={styles.count}>
          {favourites.length}{" "}
          {favourites.length === 1 ? "favourite" : "favourites"}
        </span>
      </div>

      <PairList>
        {data.map((snapshot) => (
          <FavouritesItem
            key={createPairKey(snapshot)}
            base={snapshot.base}
            quote={snapshot.quote}
            rate={snapshot.rate}
            changePct={snapshot.changePct}
            onToggle={toggle}
          />
        ))}
      </PairList>
    </section>
  );
};
