import type { TblReport } from "@/models/types";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

export class ReportStore extends PersistentStore<TblReport> {
  protected storageKey: keyof Tables = "tblReport";

  constructor(root: RootStore) {
    super(root);
  }

  getByBranch(branchId: string) {
    return this.list().filter((report) => report.branchId === branchId);
  }

  addReport(report: Omit<TblReport, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt">) {
    const now = nowISO();
    const record: TblReport = {
      ...report,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      finalized: report.finalized ?? false,
      deleted: false,
    };
    this.items.push(record);
    this.persist();
    return record;
  }

  updateReport(id: string, updates: Partial<Omit<TblReport, "id" | "createdAt">>) {
    const report = this.getById(id);
    if (!report) return null;
    Object.assign(report, updates, { updatedAt: nowISO() });
    this.persist();
    return report;
  }

  deleteReport(id: string) {
    const report = this.getById(id);
    if (!report) return false;
    this.softDelete(report);
    this.persist();
    return true;
  }

  finalizeReport(id: string) {
    const report = this.getById(id);
    if (!report || report.finalized) return report ?? null;
    report.finalized = true;
    report.updatedAt = nowISO();
    this.persist();
    return report;
  }
}
