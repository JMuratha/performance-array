var PerformanceArray;
(function (PerformanceArray) {
    var IndexFinder = (function () {
        function IndexFinder(options) {
            this._options = options;
        }
        IndexFinder.prototype.findIndexOptionsForQuery = function (query) {
            var propertyNames = Object.keys(query);
            var currentMatchCount = 0;
            var options = null;
            for (var _i = 0, _a = this._options.indices; _i < _a.length; _i++) {
                var indexOpts = _a[_i];
                var matchCount = this._findMatchCount(propertyNames, indexOpts.propertyNames);
                if (matchCount > currentMatchCount) {
                    currentMatchCount = matchCount;
                    options = indexOpts;
                }
            }
            return options;
        };
        IndexFinder.prototype._findMatchCount = function (queryPropertyNames, indexPropertyNames) {
            if (queryPropertyNames.length < indexPropertyNames.length) {
                return 0;
            }
            for (var _i = 0, indexPropertyNames_1 = indexPropertyNames; _i < indexPropertyNames_1.length; _i++) {
                var indexPropertyName = indexPropertyNames_1[_i];
                if (queryPropertyNames.indexOf(indexPropertyName) === -1) {
                    return 0;
                }
            }
            return indexPropertyNames.length;
        };
        return IndexFinder;
    }());
    PerformanceArray.IndexFinder = IndexFinder;
})(PerformanceArray || (PerformanceArray = {}));
var expect = require('chai').expect;
var PerformanceArray;
(function (PerformanceArray) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.normalizeUndefined = function (value) {
            return value != null ? value : null;
        };
        return Utils;
    }());
    PerformanceArray.Utils = Utils;
})(PerformanceArray || (PerformanceArray = {}));
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
                this._removeItemFromIndexNameMapByValue(item, indexOpts);
            }
        };
        KeyStorage.prototype.updateItem = function (item) {
            for (var _i = 0, _a = this._options.indices; _i < _a.length; _i++) {
                var indexOpts = _a[_i];
                var items = this.queryItemsByIndexOpts(item, indexOpts);
                if (items.indexOf(item) === -1) {
                    this._removeItemFromIndexNameMap(item, indexOpts);
                    this._addItemToIndexNameMap(item, indexOpts);
                }
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
        KeyStorage.prototype.createIndexFinder = function () {
            return new PerformanceArray.IndexFinder(this._options);
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
            if (items.indexOf(item) === -1) {
                items.push(item);
            }
        };
        KeyStorage.prototype._removeItemFromIndexNameMapByValue = function (item, indexOpts) {
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
        KeyStorage.prototype._removeItemFromIndexNameMap = function (item, indexOpts) {
            var indexMap = this._indexNameMap[this._generateIndexName(indexOpts)];
            for (var key in indexMap) {
                if (!indexMap.hasOwnProperty(key)) {
                    continue;
                }
                var items = indexMap[key];
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
                valueMap[name] = PerformanceArray.Utils.normalizeUndefined(item[name]);
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
var SpecTestData = (function () {
    function SpecTestData() {
    }
    SpecTestData.fillKeyStorageWithUsers = function (keyStorage) {
        this.generateUserList().forEach(function (u) { return keyStorage.addItem(u); });
    };
    SpecTestData.generateUserList = function () {
        return [
            this.frank,
            this.clara,
            this.martin,
            this.max,
            this.dara,
            this.stranger,
            this.karl
        ];
    };
    SpecTestData.generatePerformanceArrayOptions = function () {
        return {
            indices: [
                this.idIndexOpts,
                this.valueIndexOpts,
                this.nameValueIndexOpts
            ]
        };
    };
    SpecTestData.frank = {
        id: 10,
        name: 'frank',
        value: 5,
        unindexedProperty: 'frank is cool'
    };
    SpecTestData.clara = {
        id: 20,
        name: 'clara',
        value: 50,
        unindexedProperty: 'a cool text'
    };
    SpecTestData.martin = {
        id: 30,
        name: 'martin',
        value: 15,
        unindexedProperty: 'likes cars'
    };
    SpecTestData.max = {
        id: 40,
        name: 'max',
        value: 150,
        unindexedProperty: 'likes houses'
    };
    SpecTestData.dara = {
        id: 50,
        name: 'dara',
        value: 50,
        unindexedProperty: 'is a pilot'
    };
    SpecTestData.karl = {
        id: 60,
        name: 'karl',
        value: null,
        unindexedProperty: 'likes null'
    };
    SpecTestData.stranger = {
        id: 70,
        name: 'stranger',
        value: undefined,
        unindexedProperty: 'likes undefined'
    };
    SpecTestData.idIndexOpts = {
        propertyNames: ['id']
    };
    SpecTestData.valueIndexOpts = {
        propertyNames: ['value']
    };
    SpecTestData.nameValueIndexOpts = {
        propertyNames: ['name', 'value']
    };
    return SpecTestData;
}());
describe('IndexFinder', function () {
    var indexFinder;
    beforeEach(function () {
        indexFinder = new PerformanceArray.IndexFinder(SpecTestData.generatePerformanceArrayOptions());
    });
    it('should find the id index', function () {
        var indexOptions = indexFinder.findIndexOptionsForQuery({ id: 10 });
        expect(indexOptions).to.be.equal(SpecTestData.idIndexOpts);
    });
    it('should find the nameValue index', function () {
        var indexOptions = indexFinder.findIndexOptionsForQuery({ name: 'franz', value: null });
        expect(indexOptions).to.be.equal(SpecTestData.nameValueIndexOpts);
    });
    it('should find the value index', function () {
        var indexOptions = indexFinder.findIndexOptionsForQuery({ value: null, someProperty: '20' });
        expect(indexOptions).to.be.equal(SpecTestData.valueIndexOpts);
    });
    it('should find no index', function () {
        var indexOptions = indexFinder.findIndexOptionsForQuery({ someProperty: '20' });
        expect(indexOptions).to.be.null;
    });
});
describe('KeyStorage', function () {
    var keyStorage;
    beforeEach(function () {
        keyStorage = new PerformanceArray.KeyStorage(SpecTestData.generatePerformanceArrayOptions());
        SpecTestData.fillKeyStorageWithUsers(keyStorage);
    });
    it('should find an item by the id', function () {
        var result = keyStorage.queryItemsByIndexOpts({ id: SpecTestData.frank.id }, SpecTestData.idIndexOpts);
        expect(result[0]).to.be.equal(SpecTestData.frank);
    });
    it('should handle null and undefined in the same way', function () {
        var result = keyStorage.queryItemsByIndexOpts({ value: null }, SpecTestData.valueIndexOpts);
        expect(result).to.have.length(2, 'to find 2 items');
        expect(result).to.contain(SpecTestData.stranger, 'to find stranger');
        expect(result).to.contain(SpecTestData.karl, 'to find karl');
    });
    it('should find items with an combined index', function () {
        var query = { name: SpecTestData.max.name, value: SpecTestData.max.value };
        var result = keyStorage.queryItemsByIndexOpts(query, SpecTestData.nameValueIndexOpts);
        expect(result, 'to find max').to.deep.equal([SpecTestData.max]);
    });
    it('should be able to remove items', function () {
        keyStorage.removeItem(SpecTestData.clara);
        expect(keyStorage.queryItemsByIndexOpts({ id: SpecTestData.clara.id }, SpecTestData.idIndexOpts)).to.be.empty;
    });
    it('should move updated item to the correct index', function () {
        var oldId = SpecTestData.dara.id;
        var newId = ++SpecTestData.dara.id;
        var oldIndexItem = keyStorage.queryItemsByIndexOpts({ id: oldId }, SpecTestData.idIndexOpts)[0];
        expect(oldIndexItem, 'to find item in old index before updating').to.be.equal(SpecTestData.dara);
        keyStorage.updateItem(SpecTestData.dara);
        var oldIndexNewItem = keyStorage.queryItemsByIndexOpts({ id: oldId }, SpecTestData.idIndexOpts)[0];
        expect(oldIndexNewItem, 'to not find item in old index after updating').to.be.undefined;
        var newIndexItem = keyStorage.queryItemsByIndexOpts({ id: newId }, SpecTestData.idIndexOpts)[0];
        expect(newIndexItem, 'to find item in new index after updating').to.be.equal(SpecTestData.dara);
    });
});
var PerformanceArray;
(function (PerformanceArray) {
    var KeyStorageQuerier = (function () {
        function KeyStorageQuerier(keyStorage, allItems) {
            this._keyStorage = keyStorage;
            this._indexFinder = keyStorage.createIndexFinder();
            this._allItems = allItems;
        }
        KeyStorageQuerier.prototype.executeQuery = function (query) {
            var indexOptions = this._indexFinder.findIndexOptionsForQuery(query);
            var items = this._getItemsForIndexOptions(query, indexOptions);
            var missingQueryProperties = this._getMissingQueryProperties(query, indexOptions);
            return this._filterItemsByMissingQueryProperties(items, missingQueryProperties);
        };
        KeyStorageQuerier.prototype._getItemsForIndexOptions = function (query, indexOptions) {
            if (indexOptions) {
                return this._keyStorage.queryItemsByIndexOpts(query, indexOptions);
            }
            else {
                return this._allItems.slice();
            }
        };
        KeyStorageQuerier.prototype._getMissingQueryProperties = function (query, indexOptions) {
            var missingOptions = [];
            for (var key in query) {
                if (!query.hasOwnProperty(key)) {
                    continue;
                }
                if (!indexOptions || indexOptions.propertyNames.indexOf(key) === -1) {
                    missingOptions.push({
                        key: key,
                        value: PerformanceArray.Utils.normalizeUndefined(query[key])
                    });
                }
            }
            return missingOptions;
        };
        KeyStorageQuerier.prototype._filterItemsByMissingQueryProperties = function (items, missingQueryProperties) {
            if (missingQueryProperties.length === 0) {
                return items;
            }
            else {
                return items.filter(function (item) {
                    for (var key = 0; key < missingQueryProperties.length; key++) {
                        var missingProp = missingQueryProperties[key];
                        if (PerformanceArray.Utils.normalizeUndefined(item[missingProp.key]) !== missingProp.value) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        };
        return KeyStorageQuerier;
    }());
    PerformanceArray.KeyStorageQuerier = KeyStorageQuerier;
})(PerformanceArray || (PerformanceArray = {}));
describe('KeyStorageQuerier', function () {
    var keyStorage = new PerformanceArray.KeyStorage(SpecTestData.generatePerformanceArrayOptions());
    var users = SpecTestData.generateUserList();
    var keyStorageQuerier = new PerformanceArray.KeyStorageQuerier(keyStorage, users);
    SpecTestData.fillKeyStorageWithUsers(keyStorage);
    it('should find frank by id', function () {
        var result = keyStorageQuerier.executeQuery({ id: SpecTestData.frank.id });
        expect(result).to.have.length(1, 'to only find one item');
        expect(result[0]).to.equal(SpecTestData.frank, 'to have frank as the first item');
    });
    it('should find clara and dara by value', function () {
        var result = keyStorageQuerier.executeQuery({ value: SpecTestData.clara.value });
        expect(result).to.have.length(2, 'to only find 2 items');
        expect(result).to.contain(SpecTestData.clara, 'to find clara');
        expect(result).to.contain(SpecTestData.dara, 'to find dara');
    });
    it('should not find items with a non existing unindexedProperty', function () {
        var result = keyStorageQuerier.executeQuery({ unindexedProperty: 'this value doesn\'t exist' });
        expect(result).to.have.length(0, 'to not find an item');
    });
    it('should find max by the unindexedProperty', function () {
        var result = keyStorageQuerier.executeQuery({ unindexedProperty: SpecTestData.max.unindexedProperty });
        expect(result).to.have.length(1, 'to only find 1 item');
        expect(result).to.contain(SpecTestData.max, 'to find max');
    });
    it('should find martin by the unindexedProperty + id', function () {
        var result = keyStorageQuerier.executeQuery({
            id: SpecTestData.martin.id,
            unindexedProperty: SpecTestData.martin.unindexedProperty
        });
        expect(result).to.have.length(1, 'to only find 1 item');
        expect(result).to.contain(SpecTestData.martin, 'to find martin');
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
                throw new Error("[PerformanceArray] expected type " + this._getNameOfClass(info.type)
                    + (" but got type " + this._getNameOfClass(value.constructor) + " instead for " + key));
            }
            if (value.constructor === Array && info.subType) {
                this._validateArraySubType(value, info.subType, optionPath);
            }
            if (info.subKeyInfos) {
                if (value.constructor === Array) {
                    value.forEach(function (item, index) {
                        return _this._validateObject(item, info.subKeyInfos, optionPath + '.' + index);
                    });
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
                    throw new Error("[PerformanceArray] expected type " + _this._getNameOfClass(item.constructor)
                        + (" but got type " + _this._getNameOfClass(item.constructor) + " instead for ")
                        + optionsPath + '.' + index);
                }
            });
        };
        PerformanceArrayOptionsValidator.prototype._getNameOfClass = function (cl) {
            var result = /function ([^)]*)\(/.exec(String(cl));
            return result ? result[1] : null;
        };
        PerformanceArrayOptionsValidator.prototype._getAvailableKeyInfoByName = function (name, availableKeyInfos) {
            for (var key = 0; key < availableKeyInfos.length; key++) {
                if (availableKeyInfos[key].name === name) {
                    return availableKeyInfos[key];
                }
            }
            return null;
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PerformanceArray;
(function (PerformanceArray) {
    var ItemExistsError = (function (_super) {
        __extends(ItemExistsError, _super);
        function ItemExistsError(item) {
            var _this = _super.call(this, 'The item has already been added') || this;
            _this.item = item;
            return _this;
        }
        return ItemExistsError;
    }(Error));
    PerformanceArray.ItemExistsError = ItemExistsError;
})(PerformanceArray || (PerformanceArray = {}));
var PerformanceArray;
(function (PerformanceArray_1) {
    var PerformanceArray = (function () {
        function PerformanceArray(arrayData, options) {
            var _this = this;
            var validator = new PerformanceArray_1.PerformanceArrayOptionsValidator(options);
            validator.validate();
            this._arrayData = arrayData;
            this._keyStorage = new PerformanceArray_1.KeyStorage(options);
            this._querier = new PerformanceArray_1.KeyStorageQuerier(this._keyStorage, this._arrayData);
            this._arrayData.forEach(function (item) { return _this._keyStorage.addItem(item); });
        }
        PerformanceArray.prototype.item = function (i) {
            return this._arrayData[i];
        };
        PerformanceArray.prototype.remove = function (item) {
            var index = this._arrayData.indexOf(item);
            this.splice(index, 1);
        };
        PerformanceArray.prototype.push = function (item) {
            this._checkItemBeforeAdding(item);
            this._arrayData.push(item);
            this._keyStorage.addItem(item);
        };
        PerformanceArray.prototype.pop = function () {
            var item = this._arrayData.pop();
            if (item) {
                this._keyStorage.removeItem(item);
            }
            return item;
        };
        PerformanceArray.prototype.unshift = function (item) {
            this._checkItemBeforeAdding(item);
            this._arrayData.unshift(item);
            this._keyStorage.addItem(item);
        };
        PerformanceArray.prototype.shift = function () {
            var item = this._arrayData.shift();
            if (item) {
                this._keyStorage.removeItem(item);
            }
            return item;
        };
        PerformanceArray.prototype.splice = function (index, deleteCount) {
            var _this = this;
            var insertItems = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                insertItems[_i - 2] = arguments[_i];
            }
            insertItems.forEach(function (item) { return _this._checkItemBeforeAdding(item); });
            var spliceArgs = [index, deleteCount].concat(insertItems);
            var removedItems = this._arrayData.splice.apply(this._arrayData, spliceArgs);
            removedItems.forEach(function (item) { return _this._keyStorage.removeItem(item); });
            insertItems.forEach(function (item) { return _this._keyStorage.addItem(item); });
            return removedItems;
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
        PerformanceArray.prototype.findItem = function (query) {
            return this._querier.executeQuery(query)[0];
        };
        PerformanceArray.prototype.findItems = function (query) {
            return this._querier.executeQuery(query);
        };
        PerformanceArray.prototype.hasItem = function (item) {
            var items = this._querier.executeQuery(item);
            return items.indexOf(item) >= 0;
        };
        PerformanceArray.prototype._checkItemBeforeAdding = function (item) {
            if (this.hasItem(item)) {
                throw new PerformanceArray_1.ItemExistsError(item);
            }
        };
        return PerformanceArray;
    }());
    PerformanceArray_1.PerformanceArray = PerformanceArray;
})(PerformanceArray || (PerformanceArray = {}));
describe('PerformanceArray', function () {
    var userList;
    var performanceArray;
    beforeEach(function () {
        userList = SpecTestData.generateUserList();
        performanceArray = new PerformanceArray.PerformanceArray(userList, SpecTestData.generatePerformanceArrayOptions());
    });
    it('should be convertible to an array', function () {
        var resultData = performanceArray.toArray();
        userList.forEach(function (item, index) {
            expect(item).to.be.equal(resultData[index], "data at index " + index + " is equal");
        });
        expect(userList).to.not.be.equal(resultData, 'result array should not be equal to input array');
    });
    it('can access items at a certain index', function () {
        expect(userList[0]).to.be.equal(performanceArray.item(0), 'item at index 2 is the same');
        expect(userList[2]).to.be.equal(performanceArray.item(2), 'item at index 2 is the same');
        expect(performanceArray.item(5000), 'item at out of bounds index is undefined').to.be.undefined;
    });
    it('can push a new item', function () {
        var item = { id: 101010, name: 'new user', value: 70, unindexedProperty: 'whatever' };
        performanceArray.push(item);
        expect(performanceArray.item(performanceArray.length - 1)).to.be.equal(item, 'item is the last item');
        expect(performanceArray.findItem({ id: item.id })).to.be.equal(item, 'item can be correctly found');
    });
    it('can pop an item', function () {
        var item = performanceArray.item(performanceArray.length - 1);
        var oldLength = performanceArray.length;
        var poppedItem = performanceArray.pop();
        expect(poppedItem).to.be.equal(item, 'popped item was the last item');
        expect(performanceArray.length).to.be.equal(oldLength - 1, 'arrays length decreased by one');
        expect(performanceArray.findItem({ id: poppedItem.id })).to.be.equal(undefined, 'item cannot be found anymore');
    });
    it('can shift an item', function () {
        var item = performanceArray.item(0);
        var oldLength = performanceArray.length;
        var shiftedItem = performanceArray.shift();
        expect(shiftedItem).to.be.equal(item, 'shifted item is the first item');
        expect(performanceArray.length).to.be.equal(oldLength - 1, 'arrays length decreased by one');
        expect(performanceArray.findItem({ id: shiftedItem.id })).to.be.equal(undefined, 'item cannot be found anymore');
    });
    it('can unshift a new item', function () {
        var item = { id: 101010, name: 'new user', value: 70, unindexedProperty: 'whatever' };
        var oldLength = performanceArray.length;
        performanceArray.unshift(item);
        expect(performanceArray.item(0)).to.be.equal(item, 'item has been inserted at index 0');
        expect(performanceArray.length).to.be.equal(oldLength + 1, 'arrays length increased by one');
        expect(performanceArray.findItem({ id: item.id })).to.be.equal(item, 'item can be correctly found');
    });
    it('can splice items', function () {
        var newItem = { id: 101010, name: 'new user', value: 70, unindexedProperty: 'whatever' };
        var oldLength = performanceArray.length;
        var itemThatShouldBeRemoved = performanceArray.item(2);
        var removedItem = performanceArray.splice(2, 1, newItem)[0];
        expect(removedItem).to.be.equal(itemThatShouldBeRemoved, 'removed the correct item');
        expect(performanceArray.findItem({ id: removedItem.id })).to.be.equal(undefined, 'item cannot be found anymore');
        expect(performanceArray.length).to.be.equal(oldLength, 'array has the same length as before');
        expect(performanceArray.item(2)).to.be.equal(newItem, 'added the new item at the correct index');
        expect(performanceArray.findItem({ id: newItem.id })).to.be.equal(newItem, 'new item can be correctly found');
    });
    it('throws an error on adding an existing item', function () {
        var pushFunction = performanceArray.push.bind(performanceArray, SpecTestData.clara);
        expect(pushFunction).to.throw(/The item has already been added/, 'can\'t add an existing item');
    });
});
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