import type { TblUser } from "@/models/types";
import { MethodRequest, UserRoles, UserStatus } from "@/models/enums";
import { nowISO } from "@/utils/time";
import { uuidv7 } from "@/utils/id";
import { hashPassword, generateSalt } from "@/utils/crypto";

import { PersistentStore } from "./BaseStore";
import type { RootStore } from "./RootStore";

type Tables = import("@/models/types").Tables;

type CreateUserInput = {
  branchId: string | null;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  status?: UserStatus;
  image?: string;
};

type UpdateUserInput = Partial<Omit<TblUser, "id" | "createdAt" | "deleted" | "deletedAt">> & {
  password?: string;
};

export class UserStore extends PersistentStore<TblUser> {
  protected storageKey: keyof Tables = "tblUser";

  constructor(root: RootStore) {
    super(root);
  }

  findByEmail(email: string) {
    const lowered = email.toLowerCase();
    return this.items.find((user) => user.email.toLowerCase() === lowered && !user.deleted) ?? null;
  }

  async createUser(input: CreateUserInput) {
    const now = nowISO();
    const salt = generateSalt();
    const passwordHash = await hashPassword(input.password, salt);

    const user: TblUser = {
      id: uuidv7(),
      branchId: input.branchId,
      image: input.image,
      name: input.name,
      email: input.email,
      passwordHash,
      salt,
      role: input.role,
      status: input.status ?? UserStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };

    this.items.push(user);
    this.persist();
    this.root.logStore.record({
      table: "tblUser",
      method: MethodRequest.CREATE,
      after: user,
      userId: this.root.authStore.currentUser?.id ?? user.id,
    });

    return user;
  }

  async updateUser(id: string, updates: UpdateUserInput) {
    const user = this.getById(id);
    if (!user) return null;

    const before = { ...user };
    if (updates.password) {
      const salt = generateSalt();
      user.salt = salt;
      user.passwordHash = await hashPassword(updates.password, salt);
    }

    Object.assign(user, {
      ...updates,
      password: undefined,
      updatedAt: nowISO(),
    });

    this.persist();
    this.root.logStore.record({
      table: "tblUser",
      method: MethodRequest.UPDATE,
      before,
      after: user,
      userId: this.root.authStore.currentUser?.id ?? user.id,
    });

    return user;
  }

  softDeleteById(id: string) {
    const user = this.getById(id);
    if (!user || user.deleted) return false;
    const before = { ...user };
    super.softDelete(user);
    this.persist();
    this.root.logStore.record({
      table: "tblUser",
      method: MethodRequest.DELETE,
      before,
      after: user,
      userId: this.root.authStore.currentUser?.id ?? user.id,
    });
    return true;
  }

  recordLogin(id: string) {
    const user = this.getById(id);
    if (!user) return;
    user.lastLogin = nowISO();
    this.persist();
  }
}
