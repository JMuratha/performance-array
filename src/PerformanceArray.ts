/// <reference path="./IPerformanceArrayOptions.ts" />
/// <reference path="./PerformanceArrayOptionsValidator.ts" />
/// <reference path="./KeyStorage.ts" />
/// <reference path="./KeyStorageQuerier.ts" />
/// <reference path="./ItemExistsError.ts" />

namespace PerformanceArray {
  export class PerformanceArray<T> {

    private _arrayData: Array<T>;
    private _keyStorage: KeyStorage<T>;
    private _querier: KeyStorageQuerier<T>;

    constructor(arrayData: Array<T>, options: IPerformanceArrayOptions) {
      const validator = new PerformanceArrayOptionsValidator(options);
      validator.validate();
      
      this._arrayData = arrayData;
      this._keyStorage = new KeyStorage(options);
      this._querier = new KeyStorageQuerier(this._keyStorage, this._arrayData);

      this._arrayData.forEach(item => this._keyStorage.addItem(item));
    }

    public item(i: number): T {
      return this._arrayData[i];
    }

    public remove(item: T) {
      const index = this._arrayData.indexOf(item);
      this.splice(index, 1);
    }

    public push(item: T) {
      this._checkItemBeforeAdding(item);
      this._arrayData.push(item);
      this._keyStorage.addItem(item);
    }

    public pop(): T | undefined {
      const item: T = this._arrayData.pop();

      if (item) {
        this._keyStorage.removeItem(item);
      }

      return item;
    }

    public unshift(item: T) {
      this._checkItemBeforeAdding(item);
      this._arrayData.unshift(item);
      this._keyStorage.addItem(item);
    }

    public shift(): T | undefined {
      const item: T = this._arrayData.shift();

      if (item) {
        this._keyStorage.removeItem(item);
      }

      return item;
    }

    /**
     * returns the removed items
     * 
     * @param index 
     * @param deleteCount 
     * @param insertItems 
     */
    public splice(index: number, deleteCount: number, ...insertItems: Array<T>): Array<T> {
      insertItems.forEach(item => this._checkItemBeforeAdding(item));

      const spliceArgs = [index, deleteCount, ...insertItems];
      const removedItems: Array<T> = this._arrayData.splice.apply(this._arrayData, spliceArgs);

      removedItems.forEach(item => this._keyStorage.removeItem(item));
      insertItems.forEach(item => this._keyStorage.addItem(item));

      return removedItems;
    }

    public toArray(): Array<T> {
      return this._arrayData.slice();
    }

    public get length(): number {
      return this._arrayData.length;
    }

    /**
     * get the first item matching the query
     * 
     * @param {PerformanceArray.TQuery} query 
     */
    public findItem(query: TQuery): T {
      //TODO: improve performance by exiting on the first item found in the querier
      return this._querier.executeQuery(query)[0];
    }

    /**
     * get all items matching the query
     * 
     * @param {PerformanceArray.TQuery} query 
     */
    public findItems(query: TQuery): Array<T> {
      return this._querier.executeQuery(query);
    }

    public hasItem(item: T): boolean {
      const items = this._querier.executeQuery(item);
      return items.indexOf(item) >= 0;
    }

    private _checkItemBeforeAdding(item: T) {
      if (this.hasItem(item)) {
        throw new ItemExistsError<T>(item);
      }
    }
  }
}