/// <reference path="./TQuery.ts" />
/// <reference path="./IPerformanceArrayOptions.ts" />

namespace PerformanceArray {
  export class IndexFinder {

    private _options: IPerformanceArrayOptions;

    /**
     * 
     * @param options - have to be already validated
     */
    constructor(options: IPerformanceArrayOptions) {
      this._options = options;
    }

    public findIndexOptionsForQuery(query: TQuery): IPerformanceArrayIndexOptions | null {
      const propertyNames: Array<string> = Object.keys(query);

      let currentMatchCount: number = 0;
      let options: IPerformanceArrayIndexOptions = null;

      for (const indexOpts of this._options.indices) {
        const matchCount = this._findMatchCount(propertyNames, indexOpts.propertyNames);
        if (matchCount > currentMatchCount) {
          currentMatchCount = matchCount;
          options = indexOpts;
        }
      }

      return options;
    }

    private _findMatchCount(queryPropertyNames: Array<string>, indexPropertyNames: Array<string>): number {
      //query can only be more inclusive than the index, but not less
      if (queryPropertyNames.length < indexPropertyNames.length) {
        return 0;
      }

      for (const indexPropertyName of indexPropertyNames) {
        if (queryPropertyNames.indexOf(indexPropertyName) === -1) {
          //query doesn't contain the whole index, we can't match that
          return 0;
        }
      }

      return indexPropertyNames.length;
    }
  }
}