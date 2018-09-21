var PerformanceArray;
(function (PerformanceArray_1) {
    var PerformanceArray = (function () {
        function PerformanceArray(arrayData, options) {
            this._arrayData = arrayData;
            this._options = options ? options : {};
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
    it('can push a new item', function () {
        var item = { id: 100, value: 5482 };
        performanceArray.push(item);
        expect(performanceArray.item(performanceArray.length - 1)).to.be.equal(item);
    });
    it('can pop an item', function () {
        var item = performanceArray.item(performanceArray.length - 1);
        var oldLength = performanceArray.length;
        var poppedItem = performanceArray.pop();
        expect(poppedItem).to.be.equal(item);
        expect(performanceArray.length).to.be.equal(oldLength - 1);
    });
    it('can shift an item', function () {
        var item = performanceArray.item(0);
        var oldLength = performanceArray.length;
        var shiftedItem = performanceArray.shift();
        expect(shiftedItem).to.be.equal(item);
        expect(performanceArray.length).to.be.equal(oldLength - 1);
    });
    it('can unshift a new item', function () {
        var item = { id: 100, value: 5482 };
        var oldLength = performanceArray.length;
        performanceArray.unshift(item);
        expect(performanceArray.item(0)).to.be.equal(item);
        expect(performanceArray.length).to.be.equal(oldLength + 1);
    });
    it('can splice items', function () {
        var newItem = { id: 100, value: 5482 };
        var oldLength = performanceArray.length;
        var itemThatShouldBeRemoved = performanceArray.item(2);
        var removedItems = performanceArray.splice(2, 1, newItem);
        expect(removedItems[0], 'removed the correct item').to.be.equal(itemThatShouldBeRemoved);
        expect(performanceArray.length).to.be.equal(oldLength);
        expect(performanceArray.item(2), 'added the new item at the correct index').to.be.equal(newItem);
    });
});
var PerformanceArray;
(function (PerformanceArray) {
    var PerformanceArrayOptionsValidator = (function () {
        function PerformanceArrayOptionsValidator(options) {
            this._options = options;
        }
        PerformanceArrayOptionsValidator.prototype.validate = function () {
            this._validateObject(this._options, PerformanceArrayOptionsValidator._availableKeyInfos);
            return true;
        };
        PerformanceArrayOptionsValidator.prototype._validateObject = function (obj, availableKeyInfos, optionPath) {
            if (optionPath === void 0) { optionPath = ''; }
            for (var key in obj) {
                var value = obj[key];
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }
                this._validateKeyValue(key, value, availableKeyInfos, optionPath + '.' + key);
            }
        };
        PerformanceArrayOptionsValidator.prototype._validateKeyValue = function (key, value, availableKeyInfos, optionPath) {
            var _this = this;
            var info = this._getAvailableKeyInfoByName(key, availableKeyInfos);
            if (!info) {
                throw new Error("[PerformanceArray] invalid option " + key);
            }
            if (value.constructor !== info.type) {
                throw new Error("[PerformanceArray] expected type " + this._getNameOfClass(info.type) + " but got type " + this._getNameOfClass(value.constructor) + " instead for " + key);
            }
            if (value.constructor === Array && info.subType) {
                this._validateArraySubType(value, info.subType, optionPath);
            }
            if (info.subKeyInfos) {
                if (value.constructor === Array) {
                    value.forEach(function (item, index) { return _this._validateObject(item, info.subKeyInfos, optionPath + '.' + index); });
                }
                else {
                    this._validateObject(value, info.subKeyInfos, optionPath);
                }
            }
        };
        PerformanceArrayOptionsValidator.prototype._validateArraySubType = function (array, itemType, optionsPath) {
            var _this = this;
            array.forEach(function (item, index) {
                if (item.constructor !== itemType) {
                    throw new Error("[PerformanceArray] expected type " + _this._getNameOfClass(item.constructor) + " but got type " + _this._getNameOfClass(item.constructor) + " instead for "
                        + optionsPath + '.' + index);
                }
            });
        };
        PerformanceArrayOptionsValidator.prototype._getNameOfClass = function (cl) {
            var result = /function ([^)]*)\(/.exec(String(cl));
            return result ? result[1] : null;
        };
        PerformanceArrayOptionsValidator.prototype._getAvailableKeyInfoByName = function (name, availableKeyInfos) {
            return availableKeyInfos.find(function (info) { return info.name === name; });
        };
        PerformanceArrayOptionsValidator._availableKeyInfos = [
            {
                name: 'indices',
                type: Array,
                subKeyInfos: [
                    {
                        name: 'propertyNames',
                        type: Array,
                        subType: String
                    }
                ]
            }
        ];
        return PerformanceArrayOptionsValidator;
    }());
    PerformanceArray.PerformanceArrayOptionsValidator = PerformanceArrayOptionsValidator;
})(PerformanceArray || (PerformanceArray = {}));
describe('PerformanceArrayOptionsValidator', function () {
    it('should allow and empty object', function () {
        var validator = new PerformanceArray.PerformanceArrayOptionsValidator({});
        validator.validate();
    });
    it('should throw an error on an unknown key', function () {
        var error = null;
        try {
            var validator = new PerformanceArray.PerformanceArrayOptionsValidator({ powderThatMakesYouSayYes: 'yes' });
            validator.validate();
        }
        catch (e) {
            error = e;
        }
        expect(error).to.not.be.null;
    });
    it('should throw an error on an invalid index option key', function () {
        var error = null;
        try {
            var validator = new PerformanceArray.PerformanceArrayOptionsValidator({
                indices: [{ powderThatMakesYouSayYes: 'yes' }]
            });
            validator.validate();
        }
        catch (e) {
            error = e;
        }
        expect(error).to.not.be.null;
    });
    it('should throw an error on an invalid index property name', function () {
        var error = null;
        try {
            var validator = new PerformanceArray.PerformanceArrayOptionsValidator({
                indices: [{
                        propertyNames: [{}]
                    }]
            });
            validator.validate();
        }
        catch (e) {
            error = e;
        }
        expect(error).to.not.be.null;
    });
    it('should validate a fully configured options object', function () {
        var validator = new PerformanceArray.PerformanceArrayOptionsValidator({
            indices: [
                {
                    propertyNames: ['id']
                }
            ]
        });
        validator.validate();
    });
});
//# sourceMappingURL=performance-array.spec.js.map