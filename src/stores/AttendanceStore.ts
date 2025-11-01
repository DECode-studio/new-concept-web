import type { TblAttendance } from "@/models/types";

import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class AttendanceStore extends PersistentStore<TblAttendance> {
  protected storageKey: keyof Tables = "tblAttendance";

  constructor(root: RootStore) {
    super(root);
  }

  getByUser(userId: string) {
    return this.list().filter((attendance) => attendance.userId === userId);
  }

  getByBranch(branchId: string) {
    return this.list().filter((attendance) => attendance.branchId === branchId);
  }

  addAttendance(attendance: Omit<TblAttendance, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblAttendance = {
      ...attendance,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }
}
