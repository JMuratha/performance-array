/// <reference path="./IPerformanceArrayOptions.ts" />
var PerformanceArray;
(function (PerformanceArray_1) {
    var PerformanceArray = /** @class */ (function () {
        function PerformanceArray(arrayData, options) {
            this._arrayData = arrayData;
            this._options = options ? options : {};
        }
        PerformanceArray.prototype.toArray = function () {
            return this._arrayData.slice();
        };
        return PerformanceArray;
    }());
    PerformanceArray_1.PerformanceArray = PerformanceArray;
})(PerformanceArray || (PerformanceArray = {}));
//# sourceMappingURL=performance-array.js.map