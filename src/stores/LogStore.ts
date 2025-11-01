import { MethodRequest } from "@/models/enums";
import type { TblLog } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";

type Tables = import("@/models/types").Tables;

type RootStore = import("./RootStore").RootStore;

export class LogStore extends PersistentStore<TblLog> {
  protected storageKey: keyof Tables = "tblLog";

  constructor(root: RootStore) {
    super(root);
  }

  record({
    table,
    method,
    before,
    after,
    userId,
    reffId,
  }: {
    table: string;
    method: MethodRequest;
    before?: unknown;
    after?: unknown;
    userId: string;
    reffId?: string;
  }) {
    const entry: TblLog = {
      id: uuidv7(),
      table,
      method,
      before,
      after,
      reffId,
      userId,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      deleted: false,
    };
    this.items.push(entry);
    this.persist();
    return entry;
  }

  addLog(userId: string, table: string, method: MethodRequest, reffId?: string, before?: unknown, after?: unknown) {
    return this.record({ table, method, reffId, before, after, userId });
  }
}
