import type { CurrencyPair } from "./api/types";
import "./App.css";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";

function App() {
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
    </>
  );
}

export default App;
