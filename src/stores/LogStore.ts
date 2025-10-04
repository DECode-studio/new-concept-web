import { makeAutoObservable } from "mobx";
import { TblLog, MethodRequest } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class LogStore {
  logs: TblLog[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadLogs();
  }

  loadLogs() {
    this.logs = getFromLocalStorage<TblLog[]>("tblLog") || [];
  }

  getAllLogs() {
    return this.logs.filter(l => !l.deleted).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getLogsByUser(userId: string) {
    return this.logs.filter(l => l.userId === userId && !l.deleted);
  }

  addLog(userId: string, table: string, method: MethodRequest, reffId: string) {
    const newLog: TblLog = {
      id: `log-${Date.now()}`,
      userId,
      reffId,
      table,
      method,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.logs.push(newLog);
    this.saveLogs();
    return newLog;
  }

  private saveLogs() {
    saveToLocalStorage("tblLog", this.logs);
  }
}

export const logStore = new LogStore();
