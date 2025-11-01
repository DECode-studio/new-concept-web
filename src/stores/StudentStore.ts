import type { TblStudent } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class StudentStore extends PersistentStore<TblStudent> {
  protected storageKey: keyof Tables = "tblStudent";

  constructor(root: RootStore) {
    super(root);
  }

  getByUserId(userId: string) {
    return this.list().find((student) => student.userId === userId) ?? null;
  }

  getByBranch(branchId: string) {
    return this.list().filter((student) => student.branchId === branchId);
  }

  addStudent(student: Omit<TblStudent, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblStudent = {
      ...student,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateStudent(id: string, updates: Partial<Omit<TblStudent, "id" | "createdAt">>) {
    const student = this.getById(id);
    if (!student) return null;
    Object.assign(student, updates, { updatedAt: nowISO() });
    this.persist();
    return student;
  }
}
