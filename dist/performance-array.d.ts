declare namespace PerformanceArray {
    interface IPerformanceArrayOptions {
    }
}
declare namespace PerformanceArray {
    class PerformanceArray<T> {
        private _arrayData;
        private _options;
        constructor(arrayData: Array<T>, options?: IPerformanceArrayOptions);
        toArray(): Array<T>;
    }
}
