import { makeAutoObservable } from "mobx";
import { TblClass } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class ClassStore {
  classes: TblClass[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadClasses();
  }

  loadClasses() {
    this.classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  }

  getAllClasses() {
    return this.classes.filter(c => !c.deleted);
  }

  getClassById(id: string) {
    return this.classes.find(c => c.id === id && !c.deleted);
  }

  addClass(classData: Omit<TblClass, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newClass: TblClass = {
      ...classData,
      id: `class-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.classes.push(newClass);
    this.saveClasses();
    return newClass;
  }

  updateClass(id: string, updates: Partial<TblClass>) {
    const index = this.classes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.classes[index] = {
        ...this.classes[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveClasses();
      return this.classes[index];
    }
    return null;
  }

  deleteClass(id: string) {
    const index = this.classes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.classes[index].deleted = true;
      this.classes[index].deletedAt = new Date();
      this.saveClasses();
      return true;
    }
    return false;
  }

  private saveClasses() {
    saveToLocalStorage("tblClass", this.classes);
  }
}

export const classStore = new ClassStore();
