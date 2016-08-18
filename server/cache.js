/**
 * Константы ошибок, используемы в модуле
 * @constant
 * @type {{code: number, message: string}}
 */
const   STOP_ITERATION      = { code: 0x00000, message: 'Stop forEach iterations' },
    EMPTY_KEY           = { code: 0x00010, message: 'Key can\'t be empty' },
    WRONG_SET_KEY_TYPE  = { code: 0x00011, message: 'Key datatype can\'t by a array'},
    WRONG_GET_KEY_TYPE  = { code: 0x00012, message: 'Key datatype can\'t by a object' },
    EMPTY_DATA          = { code: 0x00020, message: 'Data can\'t be empty. For clear by key use \'flush\' function' },
    UNKNOWN_ERROR       = { code: 0x99999, message: 'Unknown error' };

var _cache = {};
/**
 * Натройки по умолчанию для кэша
 * @namespace
 * @property {boolean} overwrite - перезаписывать ли значение по уже имеющемуся ключу
 */
var defaultOptions = {
    overwrite: true
};
/**
 * Полифилл для Object.assign
 */
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
/**
 * Конструктор ошибки кэша
 * @param {Object} [err=UNKNOWN_ERROR]  - объект ошибки
 * @param {number} err.code             - код
 * @param {string} err.message          - сообщение
 * @constructor
 */
function CacheError(err) {
    err = err || UNKNOWN_ERROR;
    this.prototype = new Error();
    this.name = 'CacheError';
    this.message = err.message;
    this.code = err.code;
    Error.captureStackTrace(this, this.constructor);
}
/**
 * Функция для перебора всех элементов массива или объекта
 * @param {Array|Object} arr              - перебираемый объект
 * @param {Function} [func=function() {}] - функция, выполняемая для каждого элемента
 * @param {*} [scope=this]                - контекст для функции
 * @param {boolean} [stop=true]           - останавливать ли перебор, если функция вернула true
 */
function forEach(arr, func, scope, stop) {
    func  = func || function() {};
    scope = scope || this;
    stop = !(stop === false);
    if (Array.isArray(arr)) {
        try {
            arr.forEach(function () { if (func.apply(scope, arguments) && stop) throw STOP_ITERATION; });
        }
        catch (e) {
            if (e !== STOP_ITERATION) throw e;
        }
    }
    else {
        for (var item in arr) {
            if (arr.hasOwnProperty(item) && func.call(scope, arr[item], item, arr) && stop) break;
        }
    }
}
/**
 * Проверка является ли параметр объектом
 * @param {*} obj - проверяемое значение
 * @returns {boolean}
 */
function isObject(obj) {
    return !!obj && obj.constructor === Object;
}

function Storage(config) {
    config = config || {};
    var defOptions = Object.assign(defaultOptions, config),

        Cache = function () {
            this._defaultOptions = defOptions;
        };

    Cache.prototype = {
        /**
         * Установить значение в кэш
         * @example
         * var cache = require('cache')();
         * cache.set({ key1: "data_key1", key2: "data_key2" });
         * cache.get(["key1", "key2"]);
         * // returns { key1: "data_key1", key2: "data_key2" }
         * @example
         * var cache = require('cache')();
         * cache.set("key1", "data_key1");
         * cache.set("key2", "data_key2");
         * cache.set("key1", "data_key3", { overwrite : false });
         * cache.get(["key1", "key2"]);
         * // returns { key1: "data_key1", key2: "data_key2" }
         * @param {Object|string} key                 - объект для установки в кэш или ключ данных
         * @param {*} data                            - данные
         * @param {Object} [opt=this._defaultOptions] - опции для установки данных
         * @returns {boolean}                         - удалось ли сохранить данные в кэш
         * @throws {EMPTY_KEY}                        - пустой ключ
         * @throws {WRONG_SET_KEY_TYPE}               - ключ не может быть массивом
         * @throws {EMPTY_DATA}                       - данные не переданы
         */
        set: function (key, data, opt) {
            if (key === undefined) throw new CacheError(EMPTY_KEY);
            if (Array.isArray(key)) throw new CacheError(WRONG_SET_KEY_TYPE);
            var result = true,
                keyObj = isObject(key);
            keyObj && (opt = data);
            opt = opt || this._defaultOptions;
            if (!keyObj) {
                if (data === undefined) throw new CacheError(EMPTY_DATA);
                _cache[key] === undefined || opt.overwrite? _cache[key] = data: result = false;
            }
            else forEach(key, function(item, k) { result = result && this.set(k, item, opt); }, this);
            return result;
        },
        /**
         * Получить значение из кэша
         * @example
         * var cache = require('cache')();
         * cache.set({ key1: "data_key1", key2: "data_key2" });
         * cache.get(["key1", "key2"]);
         * // returns { key1: "data_key1", key2: "data_key2" }
         * @example
         * var cache = require('cache')();
         * cache.set({ key1: "data_key1", key2: "data_key2" });
         * cache.get("key2");
         * // returns "data_key2"
         * @param {Array|string} key    - массив ключей или ключ данных
         * @returns {[*]|*}             - объект вида ключ:данные или данные
         * @throws {EMPTY_KEY}          - пустой ключ
         * @throws {WRONG_GET_KEY_TYPE} - ключ не может быть объектом
         */
        get: function(key) {
            if (key === undefined) throw new CacheError(EMPTY_KEY);
            if (isObject(key)) throw new CacheError(WRONG_GET_KEY_TYPE);
            var result = {};
            Array.isArray(key)? forEach(key, function(item) { result[item] = this.get(item) }, this): result = _cache[key];
            return result;
        },
        /**
         * Проверить, существуют ли данные по ключу
         * @param {Array|string} key    - массив ключей или ключ данных
         * @returns {[boolean]|boolean} - объект вида ключ:существование или существование
         * @throws {EMPTY_KEY}          - пустой ключ
         * @throws {WRONG_GET_KEY_TYPE} - ключ не может быть объектом
         */
        exists: function (key) {
            if (key === undefined) throw new CacheError(EMPTY_KEY);
            if (isObject(key)) throw new CacheError(WRONG_GET_KEY_TYPE);
            var result = {};
            Array.isArray(key)?
                forEach(key, function(item) { result[item] = this.exists(item); }, this):
                (result = _cache.hasOwnProperty(key));
            return result;
        },
        /**
         * Удалить значение из кэша
         * @param {Array|string} key    - массив ключей или ключ данных
         * @returns {[boolean]|boolean} - объект вида ключ:удалено или удалено
         * @throws {EMPTY_KEY}          - пустой ключ
         * @throws {WRONG_GET_KEY_TYPE} - ключ не может быть объектом
         */
        flush: function (key) {
            if (key === undefined) throw new CacheError(EMPTY_KEY);
            if (isObject(key)) throw new CacheError(WRONG_GET_KEY_TYPE);
            var result = {};
            Array.isArray(key)? forEach(key, function(item) { result[item] = this.flush(item) }, this): result = delete _cache[key];
            return result;
        },
        /**
         * Полная очистка кэша
         */
        flushAll: function () { _cache = {}; }
    };

    return new Cache();
}

module.exports = Storage;