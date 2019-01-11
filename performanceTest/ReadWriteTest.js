(function () {

  /** @type {Array<TTestDataData>} */
  var array = [];
  /** @type {PerformanceArray.PerformanceArray<TTestDataData>} */
  var performanceArray = new PerformanceArray.PerformanceArray([], TestData.performanceArrayOptions);
  var itemCount = 50000;
  /** @type {Array<TTestDataData>} */
  var testData;

  /**
   * @returns {TRunnerTestResult}
   */
  var readWriteTest = function () {
    testData = TestData.generateTestData(itemCount);
    var itemsToFind = getItemsToFind();

    return {
      writeTimeArray: fillArray(),
      writeTimePerformanceArray: fillPerformanceArray(),
      readTimeArray: findArrayItemsById(itemsToFind),
      readTimePerformanceArray: findPerformanceArrayItemsById(itemsToFind)
    }
  };

  /**
   * @returns {number} - write time ms
   */
  var fillArray = function () {
    var stopWatch = new StopWatch();
    stopWatch.start();
    testData.forEach(function (data) {
      array.push(data);
    });
    return stopWatch.stop();
  }

  /**
   * @returns {number} - write time ms
   */
  var fillPerformanceArray = function () {
    var stopWatch = new StopWatch();
    stopWatch.start();
    testData.forEach(function (data) {
      performanceArray.push(data);
    });
    return stopWatch.stop();
  }

  var getItemsToFind = function () {
    var items = [];

    for (var key = 0; key < 500; key++) {
      var index = Math.floor(Math.random() * testData.length);
      items.push(testData[index]);
    }

    return items;
  }

  /**
   * 
   * @param {Array<TTestDataData>} items 
   * @returns {number}
   */
  var findArrayItemsById = function (items) {
    var stopWatch = new StopWatch();
    stopWatch.start();

    items.forEach(function (item) {
      array.find(function (i) { return item.id == i.id; });
    });

    return stopWatch.stop();
  }

  /**
   * 
   * @param {Array<TTestDataData>} items 
   * @returns {number}
   */
  var findPerformanceArrayItemsById = function (items) {
    var stopWatch = new StopWatch();
    stopWatch.start();

    items.forEach(function (item) {
      performanceArray.findItem({ id: item.id });
    });

    return stopWatch.stop();
  }

  Runner.registerTest({
    testName: 'Simple ReadWriteTest',
    testCallback: readWriteTest
  });
})();

