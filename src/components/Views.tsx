import { lazy, Suspense, useState } from "react";
import { useConversionLog } from "../api/conversionLog";
import { useFavourites } from "../api/favourites";
import { ViewSwitcher, type View } from "./ViewSwitcher";
import styles from "./Views.module.css";

const HistoryView = lazy(() =>
  import("./HistoryView").then((module) => ({ default: module.HistoryView })),
);

type ViewsProps = {
  base: string;
  quote: string;
};

export const Views = ({ base, quote }: ViewsProps) => {
  const [view, setView] = useState<View>("history");
  const { favourites } = useFavourites();
  const { entries } = useConversionLog();

  const counts = { favourites: favourites.length, log: entries.length };

  return (
    <section className={styles.views}>
      <div className={styles.header}>
        <ViewSwitcher value={view} onChange={setView} counts={counts} />
      </div>
      {view === "history" && (
        <Suspense fallback={<p className={styles.loading}>Loading history…</p>}>
          <HistoryView base={base} quote={quote} />
        </Suspense>
      )}
      {view === "compare" && <p>Compare view coming next.</p>}
      {view === "favourites" && <p>Favorites view coming next.</p>}
      {view === "log" && <p>Log view coming next.</p>}
    </section>
  );
};