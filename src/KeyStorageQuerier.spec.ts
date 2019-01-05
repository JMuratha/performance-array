/// <reference path="./KeyStorage.ts" />
/// <reference path="./KeyStorageQuerier.ts" />
/// <reference path="./specImports.spec.ts" />
/// <reference path="./SpecTestData.spec.ts" />

describe('KeyStorageQuerier', () => {
  const keyStorage = new PerformanceArray.KeyStorage<TSpecTestDataUser>(SpecTestData.generatePerformanceArrayOptions());
  const users: Array<TSpecTestDataUser> = SpecTestData.generateUserList();
  const keyStorageQuerier = new PerformanceArray.KeyStorageQuerier<TSpecTestDataUser>(keyStorage, users);
  SpecTestData.fillKeyStorageWithUsers(keyStorage);

  it('should find frank by id', () => {
    const result = keyStorageQuerier.executeQuery({ id: SpecTestData.frank.id });
    expect(result).to.have.length(1, 'to only find one item');
    expect(result[0]).to.equal(SpecTestData.frank, 'to have frank as the first item');
  });

  it('should find clara and dara by value', () => {
    const result = keyStorageQuerier.executeQuery({ value: SpecTestData.clara.value });
    expect(result).to.have.length(2, 'to only find 2 items');
    expect(result).to.contain(SpecTestData.clara, 'to find clara');
    expect(result).to.contain(SpecTestData.dara, 'to find dara');
  });

  it('should not find items with a non existing unindexedProperty', () => {
    const result = keyStorageQuerier.executeQuery({ unindexedProperty: 'this value doesn\'t exist' });
    expect(result).to.have.length(0, 'to not find an item');
  });

  it('should find max by the unindexedProperty', () => {
    const result = keyStorageQuerier.executeQuery({ unindexedProperty: SpecTestData.max.unindexedProperty });
    expect(result).to.have.length(1, 'to only find 1 item');
    expect(result).to.contain(SpecTestData.max, 'to find max');
  });

  it('should find martin by the unindexedProperty + id', () => {
    const result = keyStorageQuerier.executeQuery({
      id: SpecTestData.martin.id,
      unindexedProperty: SpecTestData.martin.unindexedProperty
    });
    expect(result).to.have.length(1, 'to only find 1 item');
    expect(result).to.contain(SpecTestData.martin, 'to find martin');
  });
});