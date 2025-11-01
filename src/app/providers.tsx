"use client";

import { useEffect } from "react";

import { rootStore } from "@/stores";
import { RootStoreContext } from "@/stores/RootStoreContext";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    rootStore.initialize();
  }, []);

  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}
