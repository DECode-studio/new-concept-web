import type { TblTransactionAccount } from "@/models/types";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class AccountStore extends PersistentStore<TblTransactionAccount> {
  protected storageKey: keyof Tables = "tblTransactionAccount";

  constructor(root: RootStore) {
    super(root);
  }
}
