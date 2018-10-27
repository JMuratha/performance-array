/// <reference path="./IPerformanceArrayOptions.ts" />


namespace PerformanceArray {
  interface IAvailableKeyInfo {
    name: string,
    type: any,
    subType?: any, //for arrays which don't need further validation than the type
    subKeyInfos?: Array<IAvailableKeyInfo> //only works on objects/array of objects
  }

  export class PerformanceArrayOptionsValidator {

    private _options: IPerformanceArrayOptions;

    private static _availableKeyInfos: Array<IAvailableKeyInfo> = [
      {
        name: 'indices',
        type: Array,
        subKeyInfos: [
          {
            name: 'propertyNames',
            type: Array,
            subType: String
          }
        ]
      }
    ];

    constructor(options: IPerformanceArrayOptions) {
      this._options = options;
    }

    /**
     * return true if the options object is valid, else it will throw an exception with a description
     */
    public validate(): boolean {
      this._validateObject(this._options, PerformanceArrayOptionsValidator._availableKeyInfos);
      return true;
    }

    private _validateObject(obj: Object, availableKeyInfos: Array<IAvailableKeyInfo>, optionPath: string = '') {
      for (let key in obj) {
        const value = (<any>obj)[key];
        if (!obj.hasOwnProperty(key)) {
          continue;
        }

        this._validateKeyValue(key, value, availableKeyInfos, optionPath + '.' + key);
      }
    }

    private _validateKeyValue(key: string, value: any, availableKeyInfos: Array<IAvailableKeyInfo>, optionPath: string) {
      const info = this._getAvailableKeyInfoByName(key, availableKeyInfos);
      if (!info) {
        throw new Error(`[PerformanceArray] invalid option ${key}`);
      }

      if (value.constructor !== info.type) {
        throw new Error(
          `[PerformanceArray] expected type ${this._getNameOfClass(info.type)} but got type ${this._getNameOfClass(value.constructor)} instead for ${key}`
        );
      }

      if (value.constructor === Array && info.subType) {
        this._validateArraySubType(value, info.subType, optionPath);
      }

      if (info.subKeyInfos) {
        if (value.constructor === Array) {
          value.forEach((item: any, index: number) => this._validateObject(item, info.subKeyInfos, optionPath + '.' + index));
        } else {
          this._validateObject(value, info.subKeyInfos, optionPath);
        }
      }
    }

    private _validateArraySubType(array: Array<any>, itemType: any, optionsPath: string) {
      array.forEach((item, index) => {
        if (item.constructor !== itemType) {
          throw new Error(
            `[PerformanceArray] expected type ${this._getNameOfClass(item.constructor)} but got type ${this._getNameOfClass(item.constructor)} instead for `
            + optionsPath + '.' + index
          )
        }
      })
    }

    private _getNameOfClass(cl: any): string | null {
      const result = /function ([^)]*)\(/.exec(String(cl));
      return result ? result[1] : null;
    }

    private _getAvailableKeyInfoByName(name: string, availableKeyInfos: Array<IAvailableKeyInfo>): IAvailableKeyInfo {
      return availableKeyInfos.find((info) => info.name === name)
    }
  }
}