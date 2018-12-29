/// <reference path="./IndexFinder.ts" />
/// <reference path="./specImports.spec.ts" />
/// <reference path="./SpecTestData.spec.ts" />

describe('IndexFinder', () => {

  let indexFinder: PerformanceArray.IndexFinder;

  beforeEach(() => {
    indexFinder = new PerformanceArray.IndexFinder(SpecTestData.generatePerformanceArrayOptions());
  });

  it('should find the id index', () => {
    const indexOptions = indexFinder.findIndexOptionsForQuery({ id: 10 });
    expect(indexOptions).to.be.equal(SpecTestData.idIndexOpts);
  });

  it('should find the nameValue index', () => {
    const indexOptions = indexFinder.findIndexOptionsForQuery({ name: 'franz', value: null });
    expect(indexOptions).to.be.equal(SpecTestData.nameValueIndexOpts);
  });

  it('should find the value index', () => {
    const indexOptions = indexFinder.findIndexOptionsForQuery({ value: null, someProperty: '20' });
    expect(indexOptions).to.be.equal(SpecTestData.valueIndexOpts);
  });

  it('should find no index', () => {
    const indexOptions = indexFinder.findIndexOptionsForQuery({ someProperty: '20' });
    expect(indexOptions).to.be.null;
  });
});