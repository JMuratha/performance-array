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

    toArray(): Array<T> {
      return this._arrayData.slice();
    }
  }
}