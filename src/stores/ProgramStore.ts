import { makeAutoObservable } from "mobx";
import { TblProgram } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class ProgramStore {
  programs: TblProgram[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadPrograms();
  }

  loadPrograms() {
    this.programs = getFromLocalStorage<TblProgram[]>("tblProgram") || [];
  }

  getAllPrograms() {
    return this.programs.filter(p => !p.deleted);
  }

  getProgramById(id: string) {
    return this.programs.find(p => p.id === id && !p.deleted);
  }

  addProgram(program: Omit<TblProgram, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newProgram: TblProgram = {
      ...program,
      id: `program-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.programs.push(newProgram);
    this.savePrograms();
    return newProgram;
  }

  updateProgram(id: string, updates: Partial<TblProgram>) {
    const index = this.programs.findIndex(p => p.id === id);
    if (index !== -1) {
      this.programs[index] = {
        ...this.programs[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.savePrograms();
      return this.programs[index];
    }
    return null;
  }

  deleteProgram(id: string) {
    const index = this.programs.findIndex(p => p.id === id);
    if (index !== -1) {
      this.programs[index].deleted = true;
      this.programs[index].deletedAt = new Date();
      this.savePrograms();
      return true;
    }
    return false;
  }

  private savePrograms() {
    saveToLocalStorage("tblProgram", this.programs);
  }
}

export const programStore = new ProgramStore();
