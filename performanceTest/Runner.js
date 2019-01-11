var Runner = {
  /** @type {Array<TRunnerTestConfig>} */
  _tests: [],
  /**
   * 
   * @param {TRunnerTestConfig} testCallback 
   */
  registerTest: function (testCallback) {
    this._tests.push(testCallback);
  },
  karmaStarted: function () {
    __karma__.info({ total: this._tests.length });
    this.runTests();
  },
  runTests: function () {
    var self = this;
    this._tests.forEach(function (test) {
      self._runSingleTest(test);
    });
    __karma__.complete({ coverage: 100 });
  },
  /**
   * @param {TRunnerTestConfig} test 
   */
  _runSingleTest: function (test) {
    var testResult = { readTimeArray: 0, writeTimeArray: 0, readTimePerformanceArray: 0, writeTimePerformanceArray: 0 };
    var startTime = Date.now();
    var endTime = null;
    var success = false;

    try {
      testResult = test.testCallback();
      endTime = Date.now();
      success = true;
    } catch (e) {
      console.error(e);
    }

    console.log(test.testName);
    console.log('Array write time (ms): ' + testResult.writeTimeArray);
    console.log('PerformanceArray write time (ms): ' + testResult.writeTimePerformanceArray);
    console.log('Array read time (ms): ' + testResult.readTimeArray);
    console.log('PerformanceArray read time (ms): ' + testResult.readTimePerformanceArray);

    __karma__.result({
      description: test.testName,
      suite: [],
      success: success,
      skipped: 0,
      pending: 0,
      time: 0,
      log: [
        'Array write time (ms): ' + testResult.writeTimeArray,
        'PerformanceArray write time (ms): ' + testResult.writeTimePerformanceArray
      ],
      assertionErrors: [],
      startTime: startTime,
      endTime: endTime,
    });
  }
};

__karma__.start = function () {
  Runner.karmaStarted();
};

/**
 * @typedef {Object} TRunnerTestConfig
 * @property {Object} testName
 * @property {function(): TRunnerTestResult} testCallback
 */

/**
 * @typedef {Object} TRunnerTestResult
 * @property {number} writeTimeArray
 * @property {number} readTimeArray
 * @property {number} writeTimePerformanceArray
 * @property {number} readTimePerformanceArray
 */