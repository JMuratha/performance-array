/// <reference path="./IPerformanceArrayOptions.ts" />


namespace PerformanceArray {
  type TIndexNameMap = { [s: string]: { [s: string]: Array<any> } };

  export class KeyStorage {
    private _options: IPerformanceArrayOptions;
    private _indexNameMap: TIndexNameMap;

    /**
     * 
     * @param {PerformanceArray.IPerformanceArrayOptions} options - must be already validated
     */
    constructor(options: IPerformanceArrayOptions) {
      this._options = options;
      this._createIndexNameMap();
    }

    public addItem(item: any) {
      for (const indexOpts of this._options.indices) {
        this._addItemToIndexNameMap(item, indexOpts);
      }
    }

    public removeItem(item: any) {
      for (const indexOpts of this._options.indices) {
        this._removeItemFromIndexNameMap(item, indexOpts);
      }
    }
    /**
     * 
     * @param query - a map of property name to its queried value, also all propertyNames of the indexOpts have to be present in the query!
     * @param indexOpts 
     */
    public queryItemsByIndexOpts(query: { [s: string]: any }, indexOpts: IPerformanceArrayIndexOptions): Array<any> {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
      if (!indexMap) {
        throw new Error(`[PerformanceArray] index for ${JSON.stringify(indexOpts)} doesn't exist`);
      }

      const items = indexMap[this._generateIndexValue(query, indexOpts)];
      return items ? items : [];
    }

    private _createIndexNameMap() {
      const map: TIndexNameMap = {};

      for (const indexOpts of this._options.indices) {
        const indexName: string = this._generateIndexName(indexOpts);
        map[indexName] = {};
      }

      this._indexNameMap = map;
    }

    private _addItemToIndexNameMap(item: any, indexOpts: IPerformanceArrayIndexOptions) {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
      const indexValue = this._generateIndexValue(item, indexOpts)

      let items = indexMap[indexValue]
      if (!items) {
        items = indexMap[indexValue] = [];
      }

      if (items.indexOf(item) == -1) {
        items.push(item);
      }
    }

    private _removeItemFromIndexNameMap(item: any, indexOpts: IPerformanceArrayIndexOptions) {
      const indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
      const indexValue = this._generateIndexValue(item, indexOpts)

      let items = indexMap[indexValue];

      if (items) {
        const index = items.indexOf(item);
        if (index >= 0) {
          items.splice(index, 1);
        }
      }
    }

    private _generateIndexValue(item: any, indexOpts: IPerformanceArrayIndexOptions): string {
      const valueMap: { [s: string]: any } = {};

      for (const name of indexOpts.propertyNames) {
        const value = item[name] != null ? item[name] : null;
        valueMap[name] = value;
      }

      let indexValue: string;

      try {
        indexValue = JSON.stringify(valueMap);
      } catch (e) {
        throw new Error('[PerformanceArray] Index couldn\'t be serialized!')
      }

      return indexValue;
    }

    private _generateIndexName(indexOpts: IPerformanceArrayIndexOptions): string {
      return JSON.stringify(indexOpts.propertyNames);
    }
  }
}