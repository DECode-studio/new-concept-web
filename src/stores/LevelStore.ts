import { makeAutoObservable } from "mobx";
import { TblLevel } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class LevelStore {
  levels: TblLevel[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadLevels();
  }

  loadLevels() {
    this.levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];
  }

  getAllLevels() {
    return this.levels.filter(l => !l.deleted);
  }

  getLevelsByClass(classId: string) {
    return this.levels.filter(l => l.classId === classId && !l.deleted);
  }

  getLevelById(id: string) {
    return this.levels.find(l => l.id === id && !l.deleted);
  }

  addLevel(level: Omit<TblLevel, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newLevel: TblLevel = {
      ...level,
      id: `level-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.levels.push(newLevel);
    this.saveLevels();
    return newLevel;
  }

  updateLevel(id: string, updates: Partial<TblLevel>) {
    const index = this.levels.findIndex(l => l.id === id);
    if (index !== -1) {
      this.levels[index] = {
        ...this.levels[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveLevels();
      return this.levels[index];
    }
    return null;
  }

  deleteLevel(id: string) {
    const index = this.levels.findIndex(l => l.id === id);
    if (index !== -1) {
      this.levels[index].deleted = true;
      this.levels[index].deletedAt = new Date();
      this.saveLevels();
      return true;
    }
    return false;
  }

  private saveLevels() {
    saveToLocalStorage("tblLevel", this.levels);
  }
}

export const levelStore = new LevelStore();
