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
                var name_1 = _a[_i];
                valueMap[name_1] = PerformanceArray.Utils.normalizeUndefined(item[name_1]);
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
//# sourceMappingURL=performance-array.js.map