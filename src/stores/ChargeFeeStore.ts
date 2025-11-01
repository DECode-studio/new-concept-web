import type { TblChargeFee } from "@/models/types";

import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class ChargeFeeStore extends PersistentStore<TblChargeFee> {
  protected storageKey: keyof Tables = "tblChargeFee";

  constructor(root: RootStore) {
    super(root);
  }

  findByBranch(branchId: string) {
    return this.list().filter((fee) => fee.branchId === branchId);
  }

  addFee(fee: Omit<TblChargeFee, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblChargeFee = {
      ...fee,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateFee(id: string, updates: Partial<Omit<TblChargeFee, "id" | "createdAt">>) {
    const fee = this.getById(id);
    if (!fee) return null;
    Object.assign(fee, updates, { updatedAt: nowISO() });
    this.persist();
    return fee;
  }

  deleteFee(id: string) {
    const fee = this.getById(id);
    if (!fee) return false;
    this.softDelete(fee);
    this.persist();
    return true;
  }
}
