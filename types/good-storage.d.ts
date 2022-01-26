declare module "good-storage" {
  type callback<T = any> = (key?: string, val?: any) => T;
  export class GoodStorage {
    version: string;
    storage: Storage;
    session: {
      storage: Storage;
    } & GoodStorage;
    disabled: boolean;
    set<T = any>(key: string, value: T): T | undefined;
    get<T = any, D = any>(key: string, defaultValue?: D): T | D | undefined;
    remove(key: string): undefined;
    has(key: string): boolean;
    clear(): void;
    getAll(): Record<string, any>;
    forEach(c: callback): void;
  }
  export default new GoodStorage();
}