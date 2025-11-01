import type { TblLevel } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class LevelStore extends PersistentStore<TblLevel> {
  protected storageKey: keyof Tables = "tblLevel";

  constructor(root: RootStore) {
    super(root);
  }

  addLevel(level: Omit<TblLevel, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblLevel = {
      ...level,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateLevel(id: string, updates: Partial<Omit<TblLevel, "id" | "createdAt">>) {
    const level = this.getById(id);
    if (!level) return null;
    Object.assign(level, updates, { updatedAt: nowISO() });
    this.persist();
    return level;
  }

  deleteLevel(id: string) {
    const level = this.getById(id);
    if (!level) return false;
    this.softDelete(level);
    this.persist();
    return true;
  }
}
