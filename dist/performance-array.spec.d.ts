/// <reference types="chai" />
declare namespace PerformanceArray {
    type TQuery = {
        [s: string]: any;
    };
}
declare namespace PerformanceArray {
    interface IPerformanceArrayIndexOptions {
        propertyNames: Array<string>;
    }
    interface IPerformanceArrayOptions {
        indices?: Array<IPerformanceArrayIndexOptions>;
    }
}
declare namespace PerformanceArray {
    class IndexFinder {
        private _options;
        constructor(options: IPerformanceArrayOptions);
        findIndexOptionsForQuery(query: TQuery): IPerformanceArrayIndexOptions | null;
        private _findMatchCount;
    }
}
declare const expect: Chai.ExpectStatic;
declare namespace PerformanceArray {
    class KeyStorage {
        private _options;
        private _indexNameMap;
        constructor(options: IPerformanceArrayOptions);
        addItem(item: any): void;
        removeItem(item: any): void;
        updateItem(item: any): void;
        queryItemsByIndexOpts(query: TQuery, indexOpts: IPerformanceArrayIndexOptions): Array<any>;
        private _createIndexNameMap;
        private _addItemToIndexNameMap;
        private _removeItemFromIndexNameMapByValue;
        private _removeItemFromIndexNameMap;
        private _generateIndexValue;
        private _generateIndexName;
    }
}
declare namespace PerformanceArray {
    class PerformanceArray<T> {
        private _arrayData;
        constructor(arrayData: Array<T>);
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
