/* eslint-disable @typescript-eslint/no-var-requires */

const isBrowser = () => typeof window !== "undefined";

const getCrypto = () => {
  if (isBrowser() && typeof window.crypto?.getRandomValues === "function") {
    return window.crypto;
  }
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    return globalThis.crypto;
  }
  throw new Error("crypto.getRandomValues is not available");
};

const toHex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const fallbackUuidV7 = (dateInput: number = Date.now()): string => {
  const crypto = getCrypto();
  const unixTimeMs = BigInt(dateInput);
  const timeBytes = new Uint8Array(6);
  let timeValue = unixTimeMs;
  for (let i = 5; i >= 0; i -= 1) {
    timeBytes[i] = Number(timeValue & BigInt(0xff));
    timeValue >>= BigInt(8);
  }

  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);

  const bytes = new Uint8Array(16);
  bytes.set(timeBytes, 0);
  bytes.set(rand, 6);

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = toHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

let uuidV7FromLib: ((options?: { msecs?: number }) => string) | undefined;

try {
  // eslint-disable-next-line global-require
  const { v7 } = require("uuid") as { v7?: (options?: { msecs?: number }) => string };
  uuidV7FromLib = typeof v7 === "function" ? v7 : undefined;
} catch (error) {
  uuidV7FromLib = undefined;
}

export function uuidv7(dateInput?: number): string {
  if (uuidV7FromLib) {
    if (typeof dateInput === "number") {
      return uuidV7FromLib({ msecs: dateInput });
    }
    return uuidV7FromLib();
  }
  return fallbackUuidV7(dateInput ?? Date.now());
}
