/// <reference path="./TQuery.ts" />
/// <reference path="./IPerformanceArrayOptions.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./IndexFinder.ts" />


namespace PerformanceArray {
  type TIndexNameMap<T> = { [s: string]: { [s: string]: Array<T> } };

  export class KeyStorage<T> {
    private _options: IPerformanceArrayOptions;
    private _indexNameMap: TIndexNameMap<T>;

    /**
     * 
     * @param {PerformanceArray.IPerformanceArrayOptions} options - must be already validated
     */
    constructor(options: IPerformanceArrayOptions) {
      this._options = options;
      this._createIndexNameMap();
    }

    public addItem(item: T) {
      for (const indexOpts of this._options.indices) {
        this._addItemToIndexNameMap(item, indexOpts);
      }
    }

    public removeItem(item: T) {
      for (const indexOpts of this._options.indices) {
        this._removeItemFromIndexNameMapByValue(item, indexOpts);
      }
    }

    public updateItem(item: T) {
      for (const indexOpts of this._options.indices) {
        const items = this.queryItemsByIndexOpts(item, indexOpts);

        if (items.indexOf(item) === -1) {
          this._removeItemFromIndexNameMap(item, indexOpts);
          this._addItemToIndexNameMap(item, indexOpts);
        }
      }
    }

    /**
     * 
     * @param query - all propertyNames of the indexOpts have to be present in the query!
     * @param indexOpts 
     */
    public queryItemsByIndexOpts(query: TQuery, indexOpts: IPerformanceArrayIndexOptions): Array<T> {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
      if (!indexMap) {
        throw new Error(`[PerformanceArray] index for ${JSON.stringify(indexOpts)} doesn't exist`);
      }

      const items = indexMap[this._generateIndexValue(<any>query, indexOpts)];
      return items ? items : [];
    }

    public createIndexFinder(): IndexFinder {
      return new IndexFinder(this._options);
    }
    
    private _createIndexNameMap() {
      const map: TIndexNameMap<T> = {};

      for (const indexOpts of this._options.indices) {
        const indexName: string = this._generateIndexName(indexOpts);
        map[indexName] = {};
      }

      this._indexNameMap = map;
    }

    private _addItemToIndexNameMap(item: T, indexOpts: IPerformanceArrayIndexOptions) {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
      const indexValue = this._generateIndexValue(item, indexOpts);

      let items = indexMap[indexValue];
      if (!items) {
        items = indexMap[indexValue] = [];
      }

      if (items.indexOf(item) === -1) {
        items.push(item);
      }
    }

    /**
     * removes the item from its correct index, this is the more performant version of _removeItemFromIndexNameMap
     * but it only works when the item is stored correctly!
     * 
     * @param item 
     * @param indexOpts 
     */
    private _removeItemFromIndexNameMapByValue(item: T, indexOpts: IPerformanceArrayIndexOptions) {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
      const indexValue = this._generateIndexValue(item, indexOpts);

      let items = indexMap[indexValue];

      if (items) {
        const index = items.indexOf(item);
        if (index >= 0) {
          items.splice(index, 1);
        }
      }
    }

    /**
     * removes the item from the whole index specified
     * 
     * @param item 
     * @param indexOpts 
     */
    private _removeItemFromIndexNameMap(item: T, indexOpts: IPerformanceArrayIndexOptions) {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];

      for (const key in indexMap) {
        if (!indexMap.hasOwnProperty(key)) {
          continue;
        }

        const items = indexMap[key];
        const index = items.indexOf(item);

        if (index >= 0) {
          items.splice(index, 1);
        }
      }
    }

    private _generateIndexValue(item: T, indexOpts: IPerformanceArrayIndexOptions): string {
      const valueMap: { [s: string]: T } = {};

      for (const name of indexOpts.propertyNames) {
        valueMap[name] = Utils.normalizeUndefined((<any>item)[name]);
      }

      let indexValue: string;

      try {
        indexValue = JSON.stringify(valueMap);
      } catch (e) {
        throw new Error('[PerformanceArray] Index couldn\'t be serialized!');
      }

      return indexValue;
    }

    private _generateIndexName(indexOpts: IPerformanceArrayIndexOptions): string {
      return JSON.stringify(indexOpts.propertyNames);
    }
  }
}