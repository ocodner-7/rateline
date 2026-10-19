import { useState, type ChangeEvent } from "react";
import { formatAmount } from "../api/format";
import styles from "./AmountInput.module.css";

const ALLOWED_CHARACTERS = "0123456789,.";

interface AmountInputProps {
  id: string;
  label: string;
  value: string; // raw text, owned by the parent (Converter)
  onChange: (next: string) => void;
}

export const AmountInput = ({
  id,
  label,
  value,
  onChange,
}: AmountInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    // ignore any keystroke that would add something other than digits, commas or a dot
    if ([...next].every((char) => ALLOWED_CHARACTERS.includes(char))) {
      onChange(next);
    }
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type="text"
        inputMode="decimal"
        placeholder="0"
        autoComplete="off"
        value={isFocused ? value : formatAmount(value)}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};
