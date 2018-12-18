/// <reference path="./IndexFinder.ts" />
/// <reference path="./specImports.spec.ts" />

describe('IndexFinder', () => {

  let indexFinder: PerformanceArray.IndexFinder;
  const idIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['id']
  };
  const valueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['value']
  };
  const nameValueIndexOpts: PerformanceArray.IPerformanceArrayIndexOptions = {
    propertyNames: ['name', 'value']
  };

  beforeEach(() => {
    indexFinder = new PerformanceArray.IndexFinder({
      indices: [idIndexOpts, nameValueIndexOpts, valueIndexOpts]
    });
  });

  it('should find the id index', () => {
    expect(indexFinder.findIndexOptionsForQuery({ id: 10 })).to.be.equal(idIndexOpts);
  });

  it('should find the nameValue index', () => {
    expect(indexFinder.findIndexOptionsForQuery({ name: 'franz', value: null })).to.be.equal(nameValueIndexOpts);
  });

  it('should find the value index', () => {
    expect(indexFinder.findIndexOptionsForQuery({ value: null, someProperty: '20' })).to.be.equal(valueIndexOpts);
  });

  it('should find no index', () => {
    expect(indexFinder.findIndexOptionsForQuery({ someProperty: '20' })).to.be.null;
  });
});