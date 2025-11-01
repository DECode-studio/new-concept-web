import { AccountCategory, TransactionStatus } from "@/models/enums";
import type { TblInvoice, TblInvoiceItem, TblVoucher } from "@/models/types";
import { buildInvoiceNumber, calculateInvoiceTotals } from "@/utils/invoice";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";
import { readStorage, writeStorage } from "@/utils/storage";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

interface CreateInvoiceInput {
  branchId: string;
  studentId: string;
  chargeId?: string;
  period: string; // YYYY-MM
  dueDate?: string;
  discountVoucherId?: string;
  status: TransactionStatus;
  createdBy: string;
  notes?: string;
  items: Array<{ description: string; qty: number; price: number }>;
}

export class InvoiceStore extends PersistentStore<TblInvoice> {
  protected storageKey: keyof Tables = "tblInvoice";
  private readonly itemStorageKey: keyof Tables = "tblInvoiceItem";
  private invoiceItems: TblInvoiceItem[] = [];

  constructor(root: RootStore) {
    super(root);
  }

  load() {
    super.load();
    this.invoiceItems = readStorage<TblInvoiceItem[]>(this.itemStorageKey, []);
  }

  protected persist() {
    super.persist();
    writeStorage<TblInvoiceItem[]>(this.itemStorageKey, this.invoiceItems);
    this.root.notifyChange(this.itemStorageKey);
  }

  listItems(invoiceId: string) {
    return this.invoiceItems.filter((item) => item.invoiceId === invoiceId);
  }

  createInvoice(input: CreateInvoiceInput) {
    const {
      branchId,
      studentId,
      chargeId,
      period,
      dueDate,
      discountVoucherId,
      status,
      createdBy,
      notes,
      items,
    } = input;

    const branch = this.root.branchStore.getById(branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }
    if (items.length === 0) {
      throw new Error("Invoice items required");
    }

    const invoiceId = uuidv7();
    const timestamp = nowISO();
    const periodKey = period.replace(/-/g, "");
    const visibleNumber = buildInvoiceNumber(branch.code, periodKey);

    const itemRecords: TblInvoiceItem[] = items.map((item) => ({
      id: uuidv7(),
      invoiceId,
      description: item.description,
      qty: item.qty,
      price: item.price,
      subtotal: item.qty * item.price,
    }));

    let voucher: TblVoucher | undefined;
    if (discountVoucherId) {
      voucher = this.root.voucherStore.getById(discountVoucherId) ?? undefined;
    }

    const totals = calculateInvoiceTotals(itemRecords, voucher);

    const invoice: TblInvoice = {
      id: invoiceId,
      visibleNumber,
      branchId,
      studentId,
      chargeId,
      period,
      dueDate,
      discountVoucherId,
      discountAmount: totals.discountAmount || undefined,
      totalAmount: totals.totalAfter,
      status,
      paidAt: status === TransactionStatus.SUCCESS ? timestamp : undefined,
      notes,
      createdBy,
      createdAt: timestamp,
      updatedAt: timestamp,
      deleted: false,
    };

    this.invoiceItems.push(...itemRecords);
    this.items.push(invoice);
    this.persist();

    if (status === TransactionStatus.SUCCESS) {
      const revenueAccount = this.root.accountStore
        .list()
        .find((account) => account.category === AccountCategory.PENDAPATAN);

      if (revenueAccount) {
        this.root.reportStore.addReport({
          accountId: revenueAccount.id,
          userId: createdBy,
          branchId,
          name: `Invoice ${visibleNumber}`,
          description: notes ?? "",
          amount: totals.totalAfter,
          status: TransactionStatus.SUCCESS,
          periodType: "MONTH",
          periodKey: period,
          finalized: false,
        });
      }
    }

    return { invoice, items: itemRecords };
  }
}
