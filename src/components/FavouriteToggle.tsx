import { Star } from "lucide-react";
import styles from "./FavouriteToggle.module.css";

type FavouriteToggleProps = {
  isFavourite: boolean;
  label: string;
  onToggle: () => void;
};

export const FavouriteToggle = ({ isFavourite, label, onToggle }: FavouriteToggleProps) => (
  <button
    type="button"
    className={styles.toggle}
    onClick={onToggle}
    aria-label={label}
    aria-pressed={isFavourite}
  >
    <Star className={styles.icon} fill={isFavourite ? "currentColor" : "none"} aria-hidden="true" />
  </button>
);