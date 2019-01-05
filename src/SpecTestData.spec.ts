/// <reference path="./KeyStorage.ts" />
/// <reference path="./IPerformanceArrayOptions.ts" />

type TSpecTestDataUser = { id: number, name: string, value: number|null, unindexedProperty: string};

class SpecTestData {
  public static frank: TSpecTestDataUser = {
    id: 10,
    name: 'frank',
    value: 5,
    unindexedProperty: 'frank is cool'
  };

  public static clara: TSpecTestDataUser = {
    id: 20,
    name: 'clara',
    value: 50,
    unindexedProperty: 'a cool text'
  };

  public static martin: TSpecTestDataUser = {
    id: 30,
    name: 'martin',
    value: 15,
    unindexedProperty: 'likes cars'
  };

  public static max: TSpecTestDataUser = {
    id: 40,
    name: 'max',
    value: 150,
    unindexedProperty: 'likes houses'
  };

  public static dara: TSpecTestDataUser = {
    id: 50,
    name: 'dara',
    value: 50,
    unindexedProperty: 'is a pilot'
  };

  public static karl: TSpecTestDataUser = {
    id: 60,
    name: 'karl',
    value: null,
    unindexedProperty: 'likes null'
  };

  public static stranger: TSpecTestDataUser = {
    id: 70,
    name: 'stranger',
    value: undefined,
    unindexedProperty: 'likes undefined'
  };

  public static idIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['id']
  };

  public static valueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['value']
  };

  public static nameValueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['name', 'value']
  };

  public static fillKeyStorageWithUsers(keyStorage: PerformanceArray.KeyStorage<TSpecTestDataUser>) {
    this.generateUserList().forEach(u => keyStorage.addItem(u));
  }

  public static generateUserList(): Array<TSpecTestDataUser> {
    return [
      this.frank,
      this.clara,
      this.martin,
      this.max,
      this.dara,
      this.stranger,
      this.karl
    ];
  }

  public static generatePerformanceArrayOptions(): PerformanceArray.IPerformanceArrayOptions {
    return {
      indices: [
        this.idIndexOpts,
        this.valueIndexOpts,
        this.nameValueIndexOpts
      ]
    };
  }
}