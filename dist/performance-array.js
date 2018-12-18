var PerformanceArray;
(function (PerformanceArray_1) {
    var PerformanceArray = (function () {
        function PerformanceArray(arrayData) {
            this._arrayData = arrayData;
        }
        PerformanceArray.prototype.item = function (i) {
            return this._arrayData[i];
        };
        PerformanceArray.prototype.remove = function (item) {
            var index = this._arrayData.indexOf(item);
            if (index >= 0) {
                this._arrayData.splice(index, 1);
            }
        };
        PerformanceArray.prototype.push = function (item) {
            this._arrayData.push(item);
        };
        PerformanceArray.prototype.pop = function () {
            return this._arrayData.pop();
        };
        PerformanceArray.prototype.unshift = function (item) {
            this._arrayData.unshift(item);
        };
        PerformanceArray.prototype.shift = function () {
            return this._arrayData.shift();
        };
        PerformanceArray.prototype.splice = function (index, deleteCount) {
            var insertItems = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                insertItems[_i - 2] = arguments[_i];
            }
            return this._arrayData.splice.apply(this._arrayData, [index, deleteCount].concat(insertItems));
        };
        PerformanceArray.prototype.toArray = function () {
            return this._arrayData.slice();
        };
        Object.defineProperty(PerformanceArray.prototype, "length", {
            get: function () {
                return this._arrayData.length;
            },
            enumerable: true,
            configurable: true
        });
        return PerformanceArray;
    }());
    PerformanceArray_1.PerformanceArray = PerformanceArray;
})(PerformanceArray || (PerformanceArray = {}));
//# sourceMappingURL=performance-array.js.map