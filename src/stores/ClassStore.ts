import type { TblClass } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class ClassStore extends PersistentStore<TblClass> {
  protected storageKey: keyof Tables = "tblClass";

  constructor(root: RootStore) {
    super(root);
  }

  addClass(classItem: Omit<TblClass, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblClass = {
      ...classItem,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateClass(id: string, updates: Partial<Omit<TblClass, "id" | "createdAt">>) {
    const classItem = this.getById(id);
    if (!classItem) return null;
    Object.assign(classItem, updates, { updatedAt: nowISO() });
    this.persist();
    return classItem;
  }

  deleteClass(id: string) {
    const classItem = this.getById(id);
    if (!classItem) return false;
    this.softDelete(classItem);
    this.persist();
    return true;
  }
}
