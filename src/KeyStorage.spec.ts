/// <reference path="./KeyStorage.ts" />
/// <reference path="./specImports.spec.ts" />

describe('KeyStorage', () => {

  let keyStorage: PerformanceArray.KeyStorage;
  const idIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['id']
  };
  const valueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['value']
  };
  const nameValueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['name', 'value']
  };

  const items = [
    {
      id: 10,
      name: 'franz',
      value: 10
    },
    {
      id: 20,
      name: 'franz',
      value: 10
    },
    {
      id: 30,
      name: 'klaus',
      value: 10
    },
    {
      id: 40,
      name: 'marta',
      value: undefined
    },
    {
      id: 50,
      name: 'lisa',
      value: null
    }
  ];

  beforeEach(() => {
    keyStorage = new PerformanceArray.KeyStorage({
      indices: [idIndexOpts, nameValueIndexOpts, valueIndexOpts]
    });

    for (const item of items) {
      keyStorage.addItem(item);
    }
  });

  it('should find an item by the id', () => {
    expect(keyStorage.queryItemsByIndexOpts({ id: 10 }, idIndexOpts)[0]).to.be.equal(items[0]);
  });

  it('should handle null and undefined in the same way', () => {
    const result = keyStorage.queryItemsByIndexOpts({ value: null }, valueIndexOpts);
    expect(result, 'to find marta and lisa').to.deep.equal([items[3], items[4]]);
  });

  it('should find items with an combined index', () => {
    const result = keyStorage.queryItemsByIndexOpts({name: 'franz', value: 10}, nameValueIndexOpts);
    expect(result, 'to find franz (id 10) and franz (id 20)').to.deep.equal([items[0], items[1]]);
  });

  it('should be able to remove items', () => {
    keyStorage.removeItem(items[0]);
    expect(keyStorage.queryItemsByIndexOpts({id: 10}, idIndexOpts)).to.be.empty;
    expect(keyStorage.queryItemsByIndexOpts({name: 'franz', value: 10}, nameValueIndexOpts)).to.have.lengthOf(1);
    expect(keyStorage.queryItemsByIndexOpts({value: 10}, valueIndexOpts)).to.have.lengthOf(2);
  });
});