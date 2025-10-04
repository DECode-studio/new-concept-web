import { makeAutoObservable } from "mobx";
import { TblStudent } from "../models/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class StudentStore {
  students: TblStudent[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadStudents();
  }

  loadStudents() {
    this.students = getFromLocalStorage<TblStudent[]>("tblStudent") || [];
  }

  getAllStudents() {
    return this.students.filter(s => !s.deleted);
  }

  getStudentsByBranch(branchId: string) {
    return this.students.filter(s => s.branchId === branchId && !s.deleted);
  }

  getStudentById(id: string) {
    return this.students.find(s => s.id === id && !s.deleted);
  }

  getStudentByUserId(userId: string) {
    return this.students.find(s => s.userId === userId && !s.deleted);
  }

  addStudent(student: Omit<TblStudent, "id" | "createdAt" | "updatedAt" | "deleted">) {
    const newStudent: TblStudent = {
      ...student,
      id: `student-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };
    this.students.push(newStudent);
    this.saveStudents();
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<TblStudent>) {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students[index] = {
        ...this.students[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.saveStudents();
      return this.students[index];
    }
    return null;
  }

  deleteStudent(id: string) {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students[index].deleted = true;
      this.students[index].deletedAt = new Date();
      this.saveStudents();
      return true;
    }
    return false;
  }

  private saveStudents() {
    saveToLocalStorage("tblStudent", this.students);
  }
}

export const studentStore = new StudentStore();
