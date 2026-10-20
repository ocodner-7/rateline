import { Tabs } from "@base-ui/react/tabs";
import { lazy, Suspense, useState } from "react";
import { useConversionLog } from "../api/conversionLog";
import { useFavourites } from "../api/favourites";
import { CompareView } from "./CompareView";
import { FavouritesView } from "./FavouritesView";
import { ConversionLogView } from "./ConversionLogView";
import { ViewSwitcher} from "./ViewSwitcher";
import { ViewTabs } from "./ViewTabs";
import styles from "./Views.module.css";
import type { View } from "../api/types";
import { isView } from "../api/constants";

const HistoryView = lazy(() =>
  import("./HistoryView").then((module) => ({ default: module.HistoryView })),
);

type ViewsProps = {
  base: string;
  quote: string;
  amount: string;
};

export const Views = ({ base, quote, amount }: ViewsProps) => {
  const [view, setView] = useState<View>("history");
  const { favourites } = useFavourites();
  const { entries } = useConversionLog();

  const counts = { favourites: favourites.length, log: entries.length };

  return (
    <Tabs.Root
      className={styles.views}
      value={view}
      onValueChange={(next) => {
        if (isView(next)) setView(next);
      }}
    >
      <div className={styles.header}>
        <div className={styles.select}>
          <ViewSwitcher value={view} onChange={setView} counts={counts} />
        </div>
        <ViewTabs counts={counts} />
      </div>

      <Tabs.Panel value="history">
        <Suspense fallback={<p className={styles.loading}>Loading history…</p>}>
          <HistoryView base={base} quote={quote} />
        </Suspense>
      </Tabs.Panel>
      <Tabs.Panel value="compare">
        <CompareView base={base} amount={amount} />
      </Tabs.Panel>
      <Tabs.Panel value="favourites">
        <FavouritesView />
      </Tabs.Panel>
      <Tabs.Panel value="log">
        <ConversionLogView />
      </Tabs.Panel>
    </Tabs.Root>
  );
};