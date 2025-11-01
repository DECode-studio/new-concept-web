import { makeAutoObservable, runInAction } from "mobx";

import { MethodRequest, UserRoles } from "@/models/enums";
import type { TblUser } from "@/models/types";
import { verifyPassword } from "@/utils/crypto";
import { readStorage, writeStorage, removeStorage } from "@/utils/storage";

import type { RootStore } from "./RootStore";

const SESSION_KEY = "session:currentUserId";

export class AuthStore {
  currentUser: TblUser | null = null;
  isAuthenticated = false;
  private initializing = false;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate() {
    if (this.initializing) return;
    this.initializing = true;
    const savedId = readStorage<string | null>(SESSION_KEY, null);
    if (savedId) {
      const user = this.root.userStore.getById(savedId);
      if (user && !user.deleted) {
        this.currentUser = user;
        this.isAuthenticated = true;
      } else {
        removeStorage(SESSION_KEY);
      }
    }
    this.initializing = false;
  }

  async login(email: string, password: string) {
    const user = this.root.userStore.findByEmail(email);
    if (!user || user.deleted) {
      return false;
    }

    const valid = await verifyPassword(password, user.salt, user.passwordHash);
    if (!valid) {
      return false;
    }

    runInAction(() => {
      this.currentUser = user;
      this.isAuthenticated = true;
    });

    this.root.userStore.recordLogin(user.id);
    writeStorage(SESSION_KEY, user.id);

    this.root.logStore.record({
      table: "auth",
      method: MethodRequest.CREATE,
      after: { userId: user.id, email: user.email },
      userId: user.id,
    });

    return true;
  }

  logout() {
    if (!this.currentUser) return;
    const user = this.currentUser;
    runInAction(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
    });
    removeStorage(SESSION_KEY);
    this.root.logStore.record({
      table: "auth",
      method: MethodRequest.DELETE,
      before: { userId: user.id, email: user.email },
      userId: user.id,
    });
  }

  getUserRole(): UserRoles | null {
    return this.currentUser?.role ?? null;
  }

  getBranchId(): string | null {
    return this.currentUser?.branchId ?? null;
  }

  getUserId(): string | null {
    return this.currentUser?.id ?? null;
  }
}
