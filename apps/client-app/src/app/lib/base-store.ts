import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";

export abstract class BaseStore<T extends object> {
  protected store: StoreApi<T>;

  constructor(createFn: (set: StoreApi<T>["setState"]) => T) {
    this.store = createStore(createFn);
  }

  public getState(): T {
    return this.store.getState();
  }

  public subscribe(listener: (state: T) => void): () => void {
    return this.store.subscribe(listener);
  }

  public use<U>(selector: (state: T) => U): U {
    return useStore(this.store, selector);
  }
}
