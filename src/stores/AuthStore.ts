import { makeAutoObservable } from "mobx";
import { TblUser } from "../models/types";
import { UserRoles } from "../models/enums";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

class AuthStore {
  currentUser: TblUser | null = null;
  isAuthenticated: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const savedUser = getFromLocalStorage<TblUser>("currentUser");
    if (savedUser) {
      this.currentUser = savedUser;
      this.isAuthenticated = true;
    }
  }

  login(email: string, password: string): boolean {
    const users = getFromLocalStorage<TblUser[]>("tblUser") || [];
    const user = users.find(
      (u) => u.email === email && u.password === password && !u.deleted
    );

    if (user) {
      user.lastLogin = new Date();
      this.currentUser = user;
      this.isAuthenticated = true;
      saveToLocalStorage("currentUser", user);
      
      // Update user in database
      const updatedUsers = users.map((u) =>
        u.id === user.id ? user : u
      );
      saveToLocalStorage("tblUser", updatedUsers);
      
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem("currentUser");
  }

  getUserRole(): UserRoles | null {
    return this.currentUser?.role || null;
  }

  getBranchId(): string | null {
    return this.currentUser?.branchId || null;
  }

  getUserId(): string | null {
    return this.currentUser?.id || null;
  }
}

export const authStore = new AuthStore();
