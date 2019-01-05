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
    class Utils {
        static normalizeUndefined(value: any): any;
    }
}
declare namespace PerformanceArray {
    class KeyStorage<T> {
        private _options;
        private _indexNameMap;
        constructor(options: IPerformanceArrayOptions);
        addItem(item: T): void;
        removeItem(item: T): void;
        updateItem(item: T): void;
        queryItemsByIndexOpts(query: TQuery, indexOpts: IPerformanceArrayIndexOptions): Array<T>;
        private _createIndexNameMap;
        private _addItemToIndexNameMap;
        private _removeItemFromIndexNameMapByValue;
        private _removeItemFromIndexNameMap;
        private _generateIndexValue;
        private _generateIndexName;
    }
}
declare type TSpecTestDataUser = {
    id: number;
    name: string;
    value: number | null;
    unindexedProperty: string;
};
declare class SpecTestData {
    static frank: TSpecTestDataUser;
    static clara: TSpecTestDataUser;
    static martin: TSpecTestDataUser;
    static max: TSpecTestDataUser;
    static dara: TSpecTestDataUser;
    static karl: TSpecTestDataUser;
    static stranger: TSpecTestDataUser;
    static idIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions;
    static valueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions;
    static nameValueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions;
    static fillKeyStorageWithUsers(keyStorage: PerformanceArray.KeyStorage<TSpecTestDataUser>): void;
    static generateUserList(): Array<TSpecTestDataUser>;
    static generatePerformanceArrayOptions(): PerformanceArray.IPerformanceArrayOptions;
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
