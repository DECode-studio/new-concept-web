import type { TblBranch } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class BranchStore extends PersistentStore<TblBranch> {
  protected storageKey: keyof Tables = "tblBranch";

  constructor(root: RootStore) {
    super(root);
  }

  getActiveBranches() {
    return this.list();
  }

  addBranch(branch: Omit<TblBranch, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblBranch = {
      ...branch,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateBranch(id: string, updates: Partial<Omit<TblBranch, "id" | "createdAt">>) {
    const branch = this.getById(id);
    if (!branch) return null;
    Object.assign(branch, updates, { updatedAt: nowISO() });
    this.persist();
    return branch;
  }

  deleteBranch(id: string) {
    const branch = this.getById(id);
    if (!branch) return false;
    this.softDelete(branch);
    this.persist();
    return true;
  }
}
