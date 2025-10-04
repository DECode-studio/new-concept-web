import { makeAutoObservable } from "mobx";
import { TblChargeFee } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class ChargeFeeStore {
  fees: TblChargeFee[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFees();
  }

  loadFees() {
    this.fees = getFromLocalStorage<TblChargeFee[]>("tblChargeFee") || [];
  }

  getAllFees() {
    return this.fees.filter(f => !f.deleted);
  }

  getFeesByBranch(branchId: string) {
    return this.fees.filter(f => f.branchId === branchId && !f.deleted);
  }

  getFeeById(id: string) {
    return this.fees.find(f => f.id === id && !f.deleted);
  }

  addFee(fee: Omit<TblChargeFee, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newFee: TblChargeFee = {
      ...fee,
      id: `fee-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.fees.push(newFee);
    this.saveFees();
    return newFee;
  }

  updateFee(id: string, updates: Partial<TblChargeFee>) {
    const index = this.fees.findIndex(f => f.id === id);
    if (index !== -1) {
      this.fees[index] = {
        ...this.fees[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveFees();
      return this.fees[index];
    }
    return null;
  }

  deleteFee(id: string) {
    const index = this.fees.findIndex(f => f.id === id);
    if (index !== -1) {
      this.fees[index].deleted = true;
      this.fees[index].deletedAt = new Date();
      this.saveFees();
      return true;
    }
    return false;
  }

  private saveFees() {
    saveToLocalStorage("tblChargeFee", this.fees);
  }
}

export const chargeFeeStore = new ChargeFeeStore();
