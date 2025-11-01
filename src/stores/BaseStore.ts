import { makeAutoObservable } from "mobx";

import type { Tables } from "@/models/types";
import { readStorage, writeStorage } from "@/utils/storage";
import { nowISO } from "@/utils/time";

type RootStore = import("./RootStore").RootStore;

export abstract class PersistentStore<
  T extends { id: string; createdAt: string; updatedAt: string; deleted: boolean; deletedAt?: string }
> {
  items: T[] = [];

  protected abstract storageKey: keyof Tables;

  protected constructor(protected readonly root: RootStore) {
    // makeAutoObservable(this, {}, { autoBind: true });
  }

  load(initialData?: T[]) {
    this.items = readStorage<T[]>(this.storageKey, initialData ?? []);
  }

  protected persist() {
    writeStorage<T[]>(this.storageKey, this.items);
    this.root.notifyChange(this.storageKey);
  }

  list(includeDeleted = false) {
    return includeDeleted ? [...this.items] : this.items.filter((item) => !item.deleted);
  }

  getById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  protected markUpdated(item: T) {
    item.updatedAt = nowISO();
  }

  protected softDelete(item: T) {
    item.deleted = true;
    item.deletedAt = nowISO();
  }
}
