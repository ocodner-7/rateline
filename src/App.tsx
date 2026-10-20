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
  const [amount, setAmount] = useState("");

  const TICKER_PAIRS: CurrencyPair[] = [
    { base: "USD", quote: "JPY" },
    { base: "USD", quote: "CHF" },
    { base: "USD", quote: "CAD" },
    { base: "USD", quote: "INR" },
    { base: "EUR", quote: "USD" },
    { base: "EUR", quote: "GBP" },
    { base: "EUR", quote: "JPY" },
    { base: "GBP", quote: "USD" },
    { base: "GBP", quote: "JPY" },
    { base: "AUD", quote: "USD" },
    
    { base: "AUD", quote: "NZD" },
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
          amount={amount}
          setAmount={setAmount}
          onFromChange={setFrom}
          onToChange={setTo}
        />

        <Views base={from} quote={to} amount={amount} />
      </main>
    </>
  );
}

export default App;
