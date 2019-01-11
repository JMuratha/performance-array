
/**
 * @property {(number|null)} _lastStartTime
 * @property {(number|null)} _totalTime
 */
var StopWatch = function () {
  this.reset();
};

StopWatch.prototype.start = function () {
  this._lastStartTime = performance.now();
};

/**
 * @returns {number} - total time in ms
 */
StopWatch.prototype.stop = function () {
  var endTime = performance.now();

  if (this._lastStartTime == null) {
    throw new Error('StopWatch stopped before starting');
  }

  if (this._totalTime == null) {
    this._totalTime = 0;
  }

  this._totalTime += (endTime - this._lastStartTime);  

  this._lastStartTime = null;

  return this._totalTime;
};

/**
 * @returns {(number|null)}
 */
StopWatch.prototype.getTotalTimeMs = function () {
  return this._totalTime;
};

StopWatch.prototype.reset = function () {
  this._lastStartTime = null;
  this._totalTime = null;
}
