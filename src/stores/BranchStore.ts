import { makeAutoObservable } from "mobx";
import { TblBranch } from "../models/types";
import { BranchType } from "../models/enums";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class BranchStore {
  branches: TblBranch[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadBranches();
  }

  loadBranches() {
    this.branches = getFromLocalStorage<TblBranch[]>("tblBranch") || [];
  }

  getAllBranches() {
    return this.branches.filter(b => !b.deleted);
  }

  getBranchById(id: string) {
    return this.branches.find(b => b.id === id && !b.deleted);
  }

  addBranch(branch: Omit<TblBranch, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newBranch: TblBranch = {
      ...branch,
      id: `branch-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.branches.push(newBranch);
    this.saveBranches();
    return newBranch;
  }

  updateBranch(id: string, updates: Partial<TblBranch>) {
    const index = this.branches.findIndex(b => b.id === id);
    if (index !== -1) {
      this.branches[index] = {
        ...this.branches[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveBranches();
      return this.branches[index];
    }
    return null;
  }

  deleteBranch(id: string) {
    const index = this.branches.findIndex(b => b.id === id);
    if (index !== -1) {
      this.branches[index].deleted = true;
      this.branches[index].deletedAt = new Date();
      this.saveBranches();
      return true;
    }
    return false;
  }

  private saveBranches() {
    saveToLocalStorage("tblBranch", this.branches);
  }
}

export const branchStore = new BranchStore();
