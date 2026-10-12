import { useCallback, useSyncExternalStore } from "react";
import { LogSchema } from "../schemas";
import { createLocalStore } from "./store";
import type { LogEntry, NewLogEntry } from "./types";

export const MAXIMUM_LOG_ENTRIES = 100;
export const LOG_STORAGE_KEY = "rateline:log:v1";
const EMPTY_LOG: LogEntry[] = [];

const conversionLogStore = createLocalStore(
  LOG_STORAGE_KEY,
  LogSchema,
  EMPTY_LOG,
);

const createLogId = () => crypto.randomUUID();

export const useConversionLog = () => {
  const entries = useSyncExternalStore(
    conversionLogStore.subscribe,
    conversionLogStore.get,
  );

  const add = useCallback((newEntry: NewLogEntry) => {
    const next: LogEntry = {
      ...newEntry,
      id: createLogId(),
      loggedAt: new Date().toISOString(),
    };

    conversionLogStore.set(
      [next, ...conversionLogStore.get()].slice(0, MAXIMUM_LOG_ENTRIES),
    );
  }, []);

  const remove = useCallback((logId: string) => {
    conversionLogStore.set(
      conversionLogStore.get().filter((l) => l.id !== logId),
    );
  }, []);

  const clear = useCallback(() => conversionLogStore.set(EMPTY_LOG), []);

  return { entries, add, remove, clear };
};
