/// <reference types="chai" />
declare namespace PerformanceArray {
    interface IPerformanceArrayOptions {
    }
}
declare namespace PerformanceArray {
    class PerformanceArray<T> {
        private _arrayData;
        private _options;
        constructor(arrayData: Array<T>, options?: IPerformanceArrayOptions);
        item(i: number): T;
        toArray(): Array<T>;
    }
}
declare const expect: Chai.ExpectStatic;
