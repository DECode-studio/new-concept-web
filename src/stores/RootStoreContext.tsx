"use client";

import { createContext, useContext } from "react";

import type { RootStore } from "./RootStore";
import { rootStore } from "./RootStore";

export const RootStoreContext = createContext<RootStore>(rootStore);

export const useRootStore = () => useContext(RootStoreContext);
