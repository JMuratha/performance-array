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
        toArray(): Array<T>;
    }
}
declare const expect: Chai.ExpectStatic;
declare namespace PerformanceArray {
    class PerformanceArrayOptionsValidator {
        private _options;
        private static _availableKeyInfos;
        constructor(options: IPerformanceArrayOptions);
        /**
         * return true if the options object is valid, else it will throw an exception with a description
         */
        validate(): boolean;
        private _validateObject;
        private _validateKeyValue;
        private _validateArraySubType;
        private _getNameOfClass;
        private _getAvailableKeyInfoByName;
    }
}
