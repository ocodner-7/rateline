import { ZodType } from "zod";

export const createLocalStore = <T>(
  key: string,
  schema: ZodType<T>,
  fallback: T,
) => {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  const read = () => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      const result = schema.safeParse(parsed);
      if (!result.success) return fallback;
      return result.data;
    } catch {
      return fallback;
    }
  };

  let current = read();

  const get = () => current;

  const write = (next: T) => {
    try {
      const serialised = JSON.stringify(next);
      localStorage.setItem(key, serialised);
    } catch (error) {
      console.error(error);
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const set = (next: T) => {
    current = next;
    write(next);
    notify();
  };

  return { get, subscribe, set };
};
