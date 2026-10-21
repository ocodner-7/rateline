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
import { StatusMessage } from "./StatusMessage";

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

type FavouritesListProps = {
  favourites: CurrencyPair[];
  onToggle: (pair: CurrencyPair) => void;
};

const FavouritesList = ({ favourites, onToggle }: FavouritesListProps) => {
  const { data, isPending, error } = usePairSnapshots(favourites);

  if (isPending) return <StatusMessage>Loading favourites…</StatusMessage>;
  if (error) return <StatusMessage>{getErrorMessage(error)}</StatusMessage>;

  return (
    <PairList>
      {data.map((snapshot) => (
        <FavouritesItem
          key={createPairKey(snapshot)}
          base={snapshot.base}
          quote={snapshot.quote}
          rate={snapshot.rate}
          changePct={snapshot.changePct}
          onToggle={onToggle}
        />
      ))}
    </PairList>
  );
};

export const FavouritesView = () => {
  const { favourites, toggle } = useFavourites();

  return (
    <section className={styles.favourites}>
      <div className={styles.bar}>
        <h3 className={styles.title}>Pinned pairs</h3>
        <span className={styles.count}>
          {favourites.length}{" "}
          {favourites.length === 1 ? "favourite" : "favourites"}
        </span>
      </div>

      {favourites.length === 0 ? (
        <StatusMessage>
          No favourites yet. Use “Favourite” above to save a pair.
        </StatusMessage>
      ) : (
        <FavouritesList favourites={favourites} onToggle={toggle} />
      )}
    </section>
  );
};