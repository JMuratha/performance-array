/// <reference path="./KeyStorage.ts" />
/// <reference path="./specImports.spec.ts" />
/// <reference path="./SpecTestData.spec.ts" />

describe('KeyStorage', () => {

  let keyStorage: PerformanceArray.KeyStorage<TSpecTestDataUser>;

  beforeEach(() => {
    keyStorage = new PerformanceArray.KeyStorage(SpecTestData.generatePerformanceArrayOptions());
    SpecTestData.fillKeyStorageWithUsers(keyStorage);
  });

  it('should find an item by the id', () => {
    const result = keyStorage.queryItemsByIndexOpts({ id: SpecTestData.frank.id }, SpecTestData.idIndexOpts);
    expect(result[0]).to.be.equal(SpecTestData.frank);
  });

  it('should handle null and undefined in the same way', () => {
    const result = keyStorage.queryItemsByIndexOpts({ value: null }, SpecTestData.valueIndexOpts);
    expect(result).to.have.length(2, 'to find 2 items');
    expect(result).to.contain(SpecTestData.stranger, 'to find stranger');
    expect(result).to.contain(SpecTestData.karl, 'to find karl');
  });

  it('should find items with an combined index', () => {
    const query: PerformanceArray.TQuery = { name: SpecTestData.max.name, value: SpecTestData.max.value };
    const result = keyStorage.queryItemsByIndexOpts(query, SpecTestData.nameValueIndexOpts);
    expect(result, 'to find max').to.deep.equal([SpecTestData.max]);
  });

  it('should be able to remove items', () => {
    keyStorage.removeItem(SpecTestData.clara);
    expect(keyStorage.queryItemsByIndexOpts({ id: SpecTestData.clara.id }, SpecTestData.idIndexOpts)).to.be.empty;
  });

  it('should move updated item to the correct index', () => {
    const oldId: number = SpecTestData.dara.id;
    const newId: number = ++SpecTestData.dara.id;

    const oldIndexItem = keyStorage.queryItemsByIndexOpts({ id: oldId }, SpecTestData.idIndexOpts)[0];
    expect(oldIndexItem, 'to find item in old index before updating').to.be.equal(SpecTestData.dara);
    keyStorage.updateItem(SpecTestData.dara);

    const oldIndexNewItem = keyStorage.queryItemsByIndexOpts({ id: oldId }, SpecTestData.idIndexOpts)[0];
    expect(oldIndexNewItem, 'to not find item in old index after updating').to.be.undefined;
    const newIndexItem = keyStorage.queryItemsByIndexOpts({ id: newId }, SpecTestData.idIndexOpts)[0];
    expect(newIndexItem, 'to find item in new index after updating').to.be.equal(SpecTestData.dara);
  });
});