import type { TblVoucher } from "@/models/types";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class VoucherStore extends PersistentStore<TblVoucher> {
  protected storageKey: keyof Tables = "tblVoucher";

  constructor(root: RootStore) {
    super(root);
  }

  getActive() {
    const now = Date.now();
    return this.list().filter((voucher) => {
      if (!voucher.active) return false;
      const startOk = voucher.startAt ? Date.parse(voucher.startAt) <= now : true;
      const endOk = voucher.endAt ? Date.parse(voucher.endAt) >= now : true;
      return startOk && endOk;
    });
  }
}
