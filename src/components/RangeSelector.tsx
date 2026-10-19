import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import styles from "./RangeSelector.module.css";

type RangeSelectorProps<T extends string> = {
  ranges: readonly T[];
  value: T;
  onChange: (range: T) => void;
};

export const RangeSelector = <T extends string>({
  ranges,
  value,
  onChange,
}: RangeSelectorProps<T>) => (
  <ToggleGroup
    className={styles.group}
    aria-label="Time range"
    value={[value]}
    onValueChange={(pressed) => {
      // Pressing the active item may give an empty array: ignore it, so a range is always selected.
      const next = ranges.find((range) => pressed.includes(range));
      if (next) onChange(next);
    }}
  >
    {ranges.map((range) => (
      <Toggle key={range} value={range} className={styles.item}>
        {range}
      </Toggle>
    ))}
  </ToggleGroup>
);