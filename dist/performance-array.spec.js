var PerformanceArray;
(function (PerformanceArray) {
    var KeyStorage = (function () {
        function KeyStorage(options) {
            this._options = options;
            this._createIndexNameMap();
        }
        KeyStorage.prototype.addItem = function (item) {
            for (var _i = 0, _a = this._options.indices; _i < _a.length; _i++) {
                var indexOpts = _a[_i];
                this._addItemToIndexNameMap(item, indexOpts);
            }
        };
        KeyStorage.prototype.removeItem = function (item) {
            for (var _i = 0, _a = this._options.indices; _i < _a.length; _i++) {
                var indexOpts = _a[_i];
                this._removeItemFromIndexNameMap(item, indexOpts);
            }
        };
        KeyStorage.prototype.queryItemsByIndexOpts = function (query, indexOpts) {
            var indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
            if (!indexMap) {
                throw new Error("[PerformanceArray] index for " + JSON.stringify(indexOpts) + " doesn't exist");
            }
            var items = indexMap[this._generateIndexValue(query, indexOpts)];
            return items ? items : [];
        };
        KeyStorage.prototype._createIndexNameMap = function () {
            var map = {};
            for (var _i = 0, _a = this._options.indices; _i < _a.length; _i++) {
                var indexOpts = _a[_i];
                var indexName = this._generateIndexName(indexOpts);
                map[indexName] = {};
            }
            this._indexNameMap = map;
        };
        KeyStorage.prototype._addItemToIndexNameMap = function (item, indexOpts) {
            var indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
            var indexValue = this._generateIndexValue(item, indexOpts);
            var items = indexMap[indexValue];
            if (!items) {
                items = indexMap[indexValue] = [];
            }
            if (items.indexOf(item) == -1) {
                items.push(item);
            }
        };
        KeyStorage.prototype._removeItemFromIndexNameMap = function (item, indexOpts) {
            var indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
            var indexValue = this._generateIndexValue(item, indexOpts);
            var items = indexMap[indexValue];
            if (items) {
                var index = items.indexOf(item);
                if (index >= 0) {
                    items.splice(index, 1);
                }
            }
        };
        KeyStorage.prototype._generateIndexValue = function (item, indexOpts) {
            var valueMap = {};
            for (var _i = 0, _a = indexOpts.propertyNames; _i < _a.length; _i++) {
                var name = _a[_i];
                var value = item[name] != null ? item[name] : null;
                valueMap[name] = value;
            }
            var indexValue;
            try {
                indexValue = JSON.stringify(valueMap);
            }
            catch (e) {
                throw new Error('[PerformanceArray] Index couldn\'t be serialized!');
            }
            return indexValue;
        };
        KeyStorage.prototype._generateIndexName = function (indexOpts) {
            return JSON.stringify(indexOpts.propertyNames);
        };
        return KeyStorage;
    }());
    PerformanceArray.KeyStorage = KeyStorage;
})(PerformanceArray || (PerformanceArray = {}));
var expect = require('chai').expect;
describe('KeyStorage', function () {
    var keyStorage;
    var idIndexOpts = {
        propertyNames: ['id']
    };
    var valueIndexOpts = {
        propertyNames: ['value']
    };
    var nameValueIndexOpts = {
        propertyNames: ['name', 'value']
    };
    var items = [
        {
            id: 10,
            name: 'franz',
            value: 10
        },
        {
            id: 20,
            name: 'franz',
            value: 10
        },
        {
            id: 30,
            name: 'klaus',
            value: 10
        },
        {
            id: 40,
            name: 'marta',
            value: undefined
        },
        {
            id: 50,
            name: 'lisa',
            value: null
        }
    ];
    beforeEach(function () {
        keyStorage = new PerformanceArray.KeyStorage({
            indices: [idIndexOpts, nameValueIndexOpts, valueIndexOpts]
        });
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            keyStorage.addItem(item);
        }
    });
    it('should find an item by the id', function () {
        expect(keyStorage.queryItemsByIndexOpts({ id: 10 }, idIndexOpts)[0]).to.be.equal(items[0]);
    });
    it('should handle null and undefined in the same way', function () {
        var result = keyStorage.queryItemsByIndexOpts({ value: null }, valueIndexOpts);
        expect(result, 'to find marta and lisa').to.deep.equal([items[3], items[4]]);
    });
    it('should find items with an combined index', function () {
        var result = keyStorage.queryItemsByIndexOpts({ name: 'franz', value: 10 }, nameValueIndexOpts);
        expect(result, 'to find franz (id 10) and franz (id 20)').to.deep.equal([items[0], items[1]]);
    });
    it('should be able to remove items', function () {
        keyStorage.removeItem(items[0]);
        expect(keyStorage.queryItemsByIndexOpts({ id: 10 }, idIndexOpts)).to.be.empty;
        expect(keyStorage.queryItemsByIndexOpts({ name: 'franz', value: 10 }, nameValueIndexOpts)).to.have.lengthOf(1);
        expect(keyStorage.queryItemsByIndexOpts({ value: 10 }, valueIndexOpts)).to.have.lengthOf(2);
    });
});
var PerformanceArray;
(function (PerformanceArray_1) {
    var PerformanceArray = (function () {
        function PerformanceArray(arrayData, options) {
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