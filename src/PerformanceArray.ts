/// <reference path="./IPerformanceArrayOptions.ts" />


namespace PerformanceArray {
  export class PerformanceArray<T> {

    private _arrayData: Array<T>;
    private _options: IPerformanceArrayOptions;

    constructor(arrayData: Array<T>, options?: IPerformanceArrayOptions) {
      this._arrayData = arrayData;
      this._options = options ? options : {};
    }

    item(i: number): T {
      return this._arrayData[i];
    }

    remove(item: T) {
      const index = this._arrayData.indexOf(item);
      if (index >= 0) {
        this._arrayData.splice(index, 1);
      }
    }

    push(item: T) {
      this._arrayData.push(item);
    }

    pop(): T | undefined {
      return this._arrayData.pop();
    }

    unshift(item: T) {
      this._arrayData.unshift(item);
    }

    shift(): T | undefined {
      return this._arrayData.shift();
    }

    /**
     * returns the removed items
     * 
     * @param index 
     * @param deleteCount 
     * @param insertItems 
     */
    splice(index: number, deleteCount: number, ...insertItems: Array<T>): Array<T> {
      return this._arrayData.splice.apply(this._arrayData, [index, deleteCount, ...insertItems]);
    }

    toArray(): Array<T> {
      return this._arrayData.slice();
    }

    get length(): number {
      return this._arrayData.length;
    }
  }
}