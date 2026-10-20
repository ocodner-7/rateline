import { Tabs } from "@base-ui/react/tabs";
import { CountBadge } from "./CountBadge";
import styles from "./ViewTabs.module.css";
import { VIEW_ITEMS } from "../api/constants";
import type { View } from "../api/types";

type ViewTabsProps = {
  counts?: Partial<Record<View, number>>;
};

export const ViewTabs = ({ counts = {} }: ViewTabsProps) => (
  <Tabs.List className={styles.list} aria-label="Views">
    {VIEW_ITEMS.map((item) => (
      <Tabs.Tab key={item.value} value={item.value} className={styles.tab}>
        {item.label}
        <CountBadge count={counts[item.value]} />
      </Tabs.Tab>
    ))}
    <Tabs.Indicator className={styles.indicator} />
  </Tabs.List>
);