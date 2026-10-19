import type { CurrencyPair } from "./api/types";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import styles from "./App.module.css";
// import { CurrencyFlag } from "./components/CurrencyFlag";
// import { CurrencyPicker } from "./components/CurrencyPicker";
// import { AmountInput } from "./components/AmountInput";
import { RateChecker } from "./components/RateChecker";
import { useState } from "react";
import { Views } from "./components/Views";

function App() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("GBP");

  const TICKER_PAIRS: CurrencyPair[] = [
    { base: "USD", quote: "JPY" },
    { base: "GBP", quote: "USD" },
    { base: "USD", quote: "CHF" },
    { base: "EUR", quote: "USD" },
    { base: "AUD", quote: "USD" },
    { base: "USD", quote: "CAD" },
  ];

  return (
    <>
      <Header>Rateline</Header>
      <Ticker pairs={TICKER_PAIRS} />

      <main className={styles.main}>

          <RateChecker
            title="CHECK THE RATE"
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
          />

        <Views base={from} quote={to} />
      </main>
    </>
  );
}

export default App;
