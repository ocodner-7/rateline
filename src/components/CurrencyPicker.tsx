import { Combobox } from "@base-ui/react/combobox";
import { Check, Search } from "lucide-react";
import { useRef, useState } from "react";
import {
  getDisplayGroups,
  groupCurrencies,
  POPULAR_CURRENCY_CODES,
  type DisplayGroup,
} from "../api/currencies";
import { useCurrencies } from "../api/queries";
import type { Currency } from "../api/types";
import { CaretDown } from "./CaretDown"; // adjust to where your CaretDown lives
import { CurrencyFlag } from "./CurrencyFlag";
import styles from "./CurrencyPicker.module.css";

type CurrencyPickerProps = {
  value: string; // the selected currency code, e.g. "GBP"
  onChange: (code: string) => void;
};

export const CurrencyPicker = ({ value, onChange }: CurrencyPickerProps) => {
  const [query, setQuery] = useState("");

  const { data } = useCurrencies();
  const currencies = data ?? [];
  const groups = getDisplayGroups(
    groupCurrencies(currencies, POPULAR_CURRENCY_CODES),
    query,
  );
  const selected =
    currencies.find((currency) => currency.iso_code === value) ?? null;

  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Combobox.Root
      items={groups}
      value={selected}
      onValueChange={(currency) => currency && onChange(currency.iso_code)}
      itemToStringLabel={(currency) => currency.iso_code}
      isItemEqualToValue={(a, b) => a.iso_code === b.iso_code}
      filter={null}
      inputValue={query}
      onInputValueChange={setQuery}
      onOpenChange={(open) => {
        if (!open) setQuery("");
      }}
    >
      <Combobox.Trigger ref={triggerRef} className={styles.trigger}>
        <CurrencyFlag code={value} />
        <span className={styles.currencyAbbr}>{value}</span>
        <CaretDown className={styles.caret} />
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner
          anchor={triggerRef}
          align="end"
          side="bottom"
          sideOffset={8}
          // collisionAvoidance={{ side: "flip", align: "none" }}
        >
          <Combobox.Popup className={styles.popup}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} aria-hidden="true" />
              <Combobox.Input
                className={styles.searchInput}
                placeholder="Search currencies..."
              />
            </div>
            <Combobox.Empty>No currencies found</Combobox.Empty>
            <Combobox.List className={styles.list}>
              {(group: DisplayGroup) => (
                <Combobox.Group
                  key={group.value}
                  items={group.items}
                  className={styles.group}
                >
                  <Combobox.GroupLabel className={styles.groupLabel}>
                    <span>{group.value.toUpperCase()}</span>
                    <span className={styles.count}>{group.total}</span>
                  </Combobox.GroupLabel>
                  <Combobox.Collection>
                    {(currency: Currency) => (
                      <Combobox.Item
                        key={currency.iso_code}
                        value={currency}
                        className={styles.item}
                      >
                        <div className={styles.countryInfo}>
                          <CurrencyFlag code={currency.iso_code} />
                          {currency.iso_code} <span className={styles.currencyName}>{currency.name}</span>
                        </div>
                        <Combobox.ItemIndicator>
                          <Check
                            className={styles.check}
                            aria-hidden="true"
                            size={18}
                          />
                        </Combobox.ItemIndicator>
                      </Combobox.Item>
                    )}
                  </Combobox.Collection>
                </Combobox.Group>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
