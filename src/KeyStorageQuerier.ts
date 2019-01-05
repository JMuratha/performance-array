/// <reference path="./KeyStorage.ts" />
/// <reference path="./IndexFinder.ts" />
/// <reference path="./TQuery.ts" />
/// <reference path="./Utils.ts" />

namespace PerformanceArray {

  type TKeyStorageQuerierMissingQueryProperty = { key: string, value: any };

  export class KeyStorageQuerier<T> {

    private _keyStorage: KeyStorage<T>;
    private _allItems: Array<T>;
    private _indexFinder: IndexFinder;

    constructor(keyStorage: KeyStorage<T>, allItems: Array<T>) {
      this._keyStorage = keyStorage;
      this._indexFinder = keyStorage.createIndexFinder();
      this._allItems = allItems;
    }

    public executeQuery(query: TQuery): Array<T> {
      const indexOptions: IPerformanceArrayIndexOptions = this._indexFinder.findIndexOptionsForQuery(query);
      const items = this._getItemsForIndexOptions(query, indexOptions);
      const missingQueryProperties = this._getMissingQueryProperties(query, indexOptions);
      return this._filterItemsByMissingQueryProperties(items, missingQueryProperties);
    }

    private _getItemsForIndexOptions(query: TQuery, indexOptions: IPerformanceArrayIndexOptions): Array<T> {
      if (indexOptions) {
        return this._keyStorage.queryItemsByIndexOpts(query, indexOptions);
      } else {
        return this._allItems.slice();
      }
    }

    private _getMissingQueryProperties(query: TQuery, indexOptions?: IPerformanceArrayIndexOptions | null):
      Array<TKeyStorageQuerierMissingQueryProperty> {

      const missingOptions: Array<TKeyStorageQuerierMissingQueryProperty> = [];

      for (const key in query) {
        if (!query.hasOwnProperty(key)) {
          continue;
        }

        if (!indexOptions || indexOptions.propertyNames.indexOf(key) === -1) {
          missingOptions.push({
            key: key,
            value: Utils.normalizeUndefined(query[key])
          });
        }
      }

      return missingOptions;
    }

    private _filterItemsByMissingQueryProperties(items: Array<T>,
      missingQueryProperties: Array<TKeyStorageQuerierMissingQueryProperty>) {

      if (missingQueryProperties.length === 0) {
        return items;
      } else {
        return items.filter((item) => {
          for (let key = 0; key < missingQueryProperties.length; key++) {
            const missingProp = missingQueryProperties[key];

            if (Utils.normalizeUndefined((<any>item)[missingProp.key]) !== missingProp.value) {
              return false;
            }
          }

          return true;
        });
      }
    }
  }
}