import { Select } from "@base-ui/react/select";
import { Check } from "lucide-react";
import { CaretDown } from "./CaretDown";
import { CountBadge } from "./CountBadge";
import styles from "./ViewSwitcher.module.css";
import type { View } from "../api/types";
import { VIEW_ITEMS } from "../api/constants";

type ViewSwitcherProps = {
  value: View;
  onChange: (view: View) => void;
  counts?: Partial<Record<View, number>>;
};

export const ViewSwitcher = ({ value, onChange, counts = {} }: ViewSwitcherProps) => (
  <Select.Root
    items={VIEW_ITEMS}
    value={value}
    onValueChange={(next) => {
      if (next) onChange(next);
    }}
  >
    <Select.Trigger className={styles.trigger} aria-label="Choose view">
      <Select.Value />
      <CountBadge count={counts[value]} />
      <Select.Icon className={styles.icon}>
        <CaretDown className={styles.caret} />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner sideOffset={8} alignItemWithTrigger={false}>
        <Select.Popup className={styles.popup}>
          <Select.List>
            {VIEW_ITEMS.map((item) => (
              <Select.Item key={item.value} value={item.value} className={styles.item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <CountBadge count={counts[item.value]} />
                <Select.ItemIndicator className={styles.indicator}>
                  <Check className={styles.check} aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
);