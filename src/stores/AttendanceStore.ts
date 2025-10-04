import { makeAutoObservable } from "mobx";
import { TblAttendance } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class AttendanceStore {
  attendances: TblAttendance[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadAttendances();
  }

  loadAttendances() {
    this.attendances = getFromLocalStorage<TblAttendance[]>("tblAttendance") || [];
  }

  getAllAttendances() {
    return this.attendances.filter(a => !a.deleted);
  }

  getAttendancesByBranch(branchId: string) {
    return this.attendances.filter(a => a.branchId === branchId && !a.deleted);
  }

  getAttendancesByUser(userId: string) {
    return this.attendances.filter(a => a.userId === userId && !a.deleted);
  }

  getAttendanceById(id: string) {
    return this.attendances.find(a => a.id === id && !a.deleted);
  }

  addAttendance(attendance: Omit<TblAttendance, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newAttendance: TblAttendance = {
      ...attendance,
      id: `attendance-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.attendances.push(newAttendance);
    this.saveAttendances();
    return newAttendance;
  }

  updateAttendance(id: string, updates: Partial<TblAttendance>) {
    const index = this.attendances.findIndex(a => a.id === id);
    if (index !== -1) {
      this.attendances[index] = {
        ...this.attendances[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveAttendances();
      return this.attendances[index];
    }
    return null;
  }

  deleteAttendance(id: string) {
    const index = this.attendances.findIndex(a => a.id === id);
    if (index !== -1) {
      this.attendances[index].deleted = true;
      this.attendances[index].deletedAt = new Date();
      this.saveAttendances();
      return true;
    }
    return false;
  }

  private saveAttendances() {
    saveToLocalStorage("tblAttendance", this.attendances);
  }
}

export const attendanceStore = new AttendanceStore();
