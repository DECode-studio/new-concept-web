const STORAGE_NAMESPACE = "nc";
const STORAGE_VERSION = "v1";

const isBrowser = () => typeof window !== "undefined";

interface StoragePayload<T> {
  version: string;
  data: T;
}

const getStorageKey = (key: string) => `${STORAGE_NAMESPACE}:${STORAGE_VERSION}:${key}`;

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(getStorageKey(key));
    if (!raw) return fallback;
    const payload = JSON.parse(raw) as Partial<StoragePayload<T>>;
    if (!payload || payload.version !== STORAGE_VERSION || payload.data === undefined) {
      return fallback;
    }
    return payload.data;
  } catch (error) {
    console.error(`Failed to read storage for key ${key}`, error);
    return fallback;
  }
}

export function writeStorage<T>(key: string, data: T): void {
  if (!isBrowser()) return;
  try {
    const payload: StoragePayload<T> = { version: STORAGE_VERSION, data };
    window.localStorage.setItem(getStorageKey(key), JSON.stringify(payload));
  } catch (error) {
    console.error(`Failed to write storage for key ${key}`, error);
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(getStorageKey(key));
  } catch (error) {
    console.error(`Failed to remove storage for key ${key}`, error);
  }
}

export function getFlag(key: string): boolean {
  return readStorage<boolean>(`flag:${key}`, false) === true;
}

export function setFlag(key: string, value: boolean): void {
  writeStorage<boolean>(`flag:${key}`, value);
}

export function listStorageKeys(): string[] {
  if (!isBrowser()) return [];
  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith(`${STORAGE_NAMESPACE}:${STORAGE_VERSION}:`))
    .map((key) => key.replace(`${STORAGE_NAMESPACE}:${STORAGE_VERSION}:`, ""));
}

export function clearNamespace(): void {
  if (!isBrowser()) return;
  listStorageKeys().forEach((key) => removeStorage(key));
}
