/// <reference path="./PerformanceArray.ts" />
/// <reference path="./specImports.spec.ts" />

describe('PerformanceArray', () => {
  let testData: Array<{id: number, value: number}>;
  let performanceArray: PerformanceArray.PerformanceArray<{id: number, value: number}>;

  beforeEach(() => {
    testData = [
      {
        id: 1,
        value: 10,
      },
      {
        id: 2,
        value: 11,
      }, {
        id: 3,
        value: 12,
      }, {
        id: 4,
        value: 13,
      }, {
        id: 5,
        value: 14,
      }
    ];

    performanceArray = new PerformanceArray.PerformanceArray(testData);
  });
  it('should be convertible to an array', () => {
    const resultData = performanceArray.toArray();

    testData.forEach((item, index) => {
      expect(item).to.be.equal(resultData[index], `data at index ${index} is equal`);
    });

    expect(testData).to.not.be.equal(resultData, 'result array should not be equal to input array');
  });

  it('can access items at a certain index', () => {
    expect(testData[0]).to.be.equal(performanceArray.item(0), 'item at index 2 is the same');
    expect(testData[2]).to.be.equal(performanceArray.item(2), 'item at index 2 is the same');
    expect(performanceArray.item(5000), 'item at out of bounds index is undefined').to.be.undefined;
  });
});