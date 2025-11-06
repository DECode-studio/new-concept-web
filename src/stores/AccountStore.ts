import type { TblTransactionAccount } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class AccountStore extends PersistentStore<TblTransactionAccount> {
  protected storageKey: keyof Tables = "tblTransactionAccount";

  constructor(root: RootStore) {
    super(root);
  }

  addAccount(account: Omit<TblTransactionAccount, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblTransactionAccount = {
      ...account,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateAccount(id: string, updates: Partial<Omit<TblTransactionAccount, "id" | "createdAt">>) {
    const account = this.getById(id);
    if (!account) return null;
    Object.assign(account, updates, { updatedAt: nowISO() });
    this.persist();
    return account;
  }

  deleteAccount(id: string) {
    const account = this.getById(id);
    if (!account) return false;
    this.softDelete(account);
    this.persist();
    return true;
  }
}
