import { readStorage, writeStorage, removeStorage, clearNamespace } from "@/utils/storage";

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  writeStorage(key, data);
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  return readStorage<T | null>(key, null);
};

export const removeFromLocalStorage = (key: string): void => {
  removeStorage(key);
};

export const clearLocalStorage = (): void => {
  clearNamespace();
};
