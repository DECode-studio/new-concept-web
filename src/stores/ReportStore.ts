import { makeAutoObservable } from "mobx";
import { TblReport } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class ReportStore {
  reports: TblReport[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadReports();
  }

  loadReports() {
    this.reports = getFromLocalStorage<TblReport[]>("tblReport") || [];
  }

  getAllReports() {
    return this.reports.filter(r => !r.deleted);
  }

  getReportsByBranch(branchId: string) {
    return this.reports.filter(r => r.branchId === branchId && !r.deleted);
  }

  getReportById(id: string) {
    return this.reports.find(r => r.id === id && !r.deleted);
  }

  addReport(report: Omit<TblReport, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newReport: TblReport = {
      ...report,
      id: `report-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.reports.push(newReport);
    this.saveReports();
    return newReport;
  }

  updateReport(id: string, updates: Partial<TblReport>) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reports[index] = {
        ...this.reports[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveReports();
      return this.reports[index];
    }
    return null;
  }

  deleteReport(id: string) {
    const index = this.reports.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reports[index].deleted = true;
      this.reports[index].deletedAt = new Date();
      this.saveReports();
      return true;
    }
    return false;
  }

  private saveReports() {
    saveToLocalStorage("tblReport", this.reports);
  }
}

export const reportStore = new ReportStore();
