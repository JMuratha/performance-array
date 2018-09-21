/// <reference types="chai" />
declare namespace PerformanceArray {
    interface IPerformanceArrayIndexOptions {
        propertyNames: Array<string>;
    }
    interface IPerformanceArrayOptions {
        indices?: Array<IPerformanceArrayIndexOptions>;
    }
}
declare namespace PerformanceArray {
    class PerformanceArray<T> {
        private _arrayData;
        private _options;
        constructor(arrayData: Array<T>, options?: IPerformanceArrayOptions);
        item(i: number): T;
        remove(item: T): void;
        push(item: T): void;
        pop(): T | undefined;
        unshift(item: T): void;
        shift(): T | undefined;
        splice(index: number, deleteCount: number, ...insertItems: Array<T>): Array<T>;
        toArray(): Array<T>;
        readonly length: number;
    }
}
declare const expect: Chai.ExpectStatic;
declare namespace PerformanceArray {
    class PerformanceArrayOptionsValidator {
        private _options;
        private static _availableKeyInfos;
        constructor(options: IPerformanceArrayOptions);
        validate(): boolean;
        private _validateObject;
        private _validateKeyValue;
        private _validateArraySubType;
        private _getNameOfClass;
        private _getAvailableKeyInfoByName;
    }
}
