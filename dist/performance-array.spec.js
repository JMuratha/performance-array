/// <reference path="./IPerformanceArrayOptions.ts" />
var PerformanceArray;
(function (PerformanceArray_1) {
    var PerformanceArray = /** @class */ (function () {
        function PerformanceArray(arrayData, options) {
            this._arrayData = arrayData;
            this._options = options ? options : {};
        }
        PerformanceArray.prototype.item = function (i) {
            return this._arrayData[i];
        };
        PerformanceArray.prototype.toArray = function () {
            return this._arrayData.slice();
        };
        return PerformanceArray;
    }());
    PerformanceArray_1.PerformanceArray = PerformanceArray;
})(PerformanceArray || (PerformanceArray = {}));
/// <reference path="./PerformanceArray.ts" />
var expect = require('chai').expect;
describe('PerformanceArray', function () {
    var testData;
    var performanceArray;
    beforeEach(function () {
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
    it('should be convertible to an array', function () {
        var resultData = performanceArray.toArray();
        testData.forEach(function (item, index) {
            expect(item).to.be.equal(resultData[index], "data at index " + index + " is equal");
        });
        expect(testData).to.not.be.equal(resultData, 'result array should not be equal to input array');
    });
    it('can access items at a certain index', function () {
        expect(testData[0]).to.be.equal(performanceArray.item(0), 'item at index 2 is the same');
        expect(testData[2]).to.be.equal(performanceArray.item(2), 'item at index 2 is the same');
        expect(performanceArray.item(5000), 'item at out of bounds index is undefined').to.be.undefined;
    });
});
//# sourceMappingURL=performance-array.spec.js.map