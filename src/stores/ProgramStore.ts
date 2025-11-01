import type { TblProgram } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class ProgramStore extends PersistentStore<TblProgram> {
  protected storageKey: keyof Tables = "tblProgram";

  constructor(root: RootStore) {
    super(root);
  }

  addProgram(program: Omit<TblProgram, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblProgram = {
      ...program,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateProgram(id: string, updates: Partial<Omit<TblProgram, "id" | "createdAt">>) {
    const program = this.getById(id);
    if (!program) return null;
    Object.assign(program, updates, { updatedAt: nowISO() });
    this.persist();
    return program;
  }

  deleteProgram(id: string) {
    const program = this.getById(id);
    if (!program) return false;
    this.softDelete(program);
    this.persist();
    return true;
  }
}
