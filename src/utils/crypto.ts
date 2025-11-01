const encoder = new TextEncoder();

const getSubtle = () => {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== "undefined" && (globalThis as any).crypto?.subtle) {
    return (globalThis as any).crypto.subtle as SubtleCrypto;
  }
  throw new Error("Web Crypto API is not available in this environment");
};

export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else if (typeof globalThis !== "undefined" && (globalThis as any).crypto?.getRandomValues) {
    (globalThis as any).crypto.getRandomValues(array);
  } else {
    throw new Error("Unable to access crypto.getRandomValues");
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(plain: string, salt: string): Promise<string> {
  const subtle = getSubtle();
  const data = encoder.encode(`${salt}:${plain}`);
  const digest = await subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(plain: string, salt: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(plain, salt);
  return computed === hash;
}
