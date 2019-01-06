/// <reference path="./PerformanceArray.ts" />
/// <reference path="./specImports.spec.ts" />
/// <reference path="./SpecTestData.spec.ts" />

describe('PerformanceArray', () => {
  let userList: Array<TSpecTestDataUser>;
  let performanceArray: PerformanceArray.PerformanceArray<TSpecTestDataUser>;

  beforeEach(() => {
    userList = SpecTestData.generateUserList();
    performanceArray = new PerformanceArray.PerformanceArray(userList, SpecTestData.generatePerformanceArrayOptions());
  });

  it('should be convertible to an array', () => {
    const resultData = performanceArray.toArray();

    userList.forEach((item, index) => {
      expect(item).to.be.equal(resultData[index], `data at index ${index} is equal`);
    });

    expect(userList).to.not.be.equal(resultData, 'result array should not be equal to input array');
  });

  it('can access items at a certain index', () => {
    expect(userList[0]).to.be.equal(performanceArray.item(0), 'item at index 2 is the same');
    expect(userList[2]).to.be.equal(performanceArray.item(2), 'item at index 2 is the same');
    expect(performanceArray.item(5000), 'item at out of bounds index is undefined').to.be.undefined;
  });

  it('can push a new item', () => {
    const item: TSpecTestDataUser = { id: 101010, name: 'new user', value: 70, unindexedProperty: 'whatever' };
    performanceArray.push(item);
    expect(performanceArray.item(performanceArray.length - 1)).to.be.equal(item, 'item is the last item');
    expect(performanceArray.findItem({ id: item.id })).to.be.equal(item, 'item can be correctly found');
  });

  it('can pop an item', () => {
    const item = performanceArray.item(performanceArray.length - 1);
    const oldLength = performanceArray.length;

    const poppedItem = performanceArray.pop();
    expect(poppedItem).to.be.equal(item, 'popped item was the last item');
    expect(performanceArray.length).to.be.equal(oldLength - 1, 'arrays length decreased by one');
    expect(performanceArray.findItem({ id: poppedItem.id })).to.be.equal(undefined, 'item cannot be found anymore');
  });

  it('can shift an item', () => {
    const item = performanceArray.item(0);
    const oldLength = performanceArray.length;

    const shiftedItem = performanceArray.shift();
    expect(shiftedItem).to.be.equal(item, 'shifted item is the first item');
    expect(performanceArray.length).to.be.equal(oldLength - 1, 'arrays length decreased by one');
    expect(performanceArray.findItem({ id: shiftedItem.id })).to.be.equal(undefined, 'item cannot be found anymore');
  });

  it('can unshift a new item', () => {
    const item = { id: 101010, name: 'new user', value: 70, unindexedProperty: 'whatever' };
    const oldLength = performanceArray.length;
    performanceArray.unshift(item);
    expect(performanceArray.item(0)).to.be.equal(item, 'item has been inserted at index 0');
    expect(performanceArray.length).to.be.equal(oldLength + 1, 'arrays length increased by one');
    expect(performanceArray.findItem({ id: item.id })).to.be.equal(item, 'item can be correctly found');
  });

  it('can splice items', () => {
    const newItem = { id: 101010, name: 'new user', value: 70, unindexedProperty: 'whatever' };
    const oldLength = performanceArray.length;
    const itemThatShouldBeRemoved = performanceArray.item(2);
    const removedItem = performanceArray.splice(2, 1, newItem)[0];

    expect(removedItem).to.be.equal(itemThatShouldBeRemoved, 'removed the correct item');
    expect(performanceArray.findItem({ id: removedItem.id })).to.be.equal(undefined, 'item cannot be found anymore');
    expect(performanceArray.length).to.be.equal(oldLength, 'array has the same length as before');
    expect(performanceArray.item(2)).to.be.equal(newItem, 'added the new item at the correct index');
    expect(performanceArray.findItem({ id: newItem.id })).to.be.equal(newItem, 'new item can be correctly found');
  });

  it('throws an error on adding an existing item', () => {
    const pushFunction: Function = performanceArray.push.bind(performanceArray, SpecTestData.clara);
    expect(pushFunction).to.throw(/The item has already been added/, 'can\'t add an existing item');
  });
});