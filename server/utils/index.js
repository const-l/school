/**
 * Created by Constantine on 20.07.2016.
 */
module.exports = exports = function utils(config) {
    config = config || {};

    var vow = require('vow');

    var _stopIteration = {},
        /**
         * Пустая функция-заглушка
         *
         * @function {function} _emptyFn
         * @private
         */
        _emptyFn = function() {},
        /**
         * Пустая асинхронная функция-заглушка
         *
         * @function {function} _emptyAsyncFn
         * @param {vow.Deferred} defer
         * @private
         */
        _emptyAsyncFn = function(defer) { defer.resolve(); };

    /**
     * Выполнить асинхронную функцию
     * @param {Function} [func=_emptyAsyncFn] - функция
     * @param {*} [ctx=this] - контекст выполнения @func
     * @returns {Promise}
     * @private
     */
    function _async(func, ctx) {
        func = func || _emptyAsyncFn;
        ctx = ctx || this;
        var defer = vow.defer(),
            args = Array.prototype.slice.call(arguments, 2);
        args.unshift(defer);
        func.apply(ctx, args);
        return defer.promise();
    }

    /**
     * Выполненить друг за другом цепочку асинхронных функций
     * @param {[Function]} iterable - массив функицй для выполнения
     * @param {*} [ctx=this] - контекст выполнеия
     * @param {Array} [res=[]] - массив результатов выполнеия функций
     * @returns {Promise}
     * @private
     */
    function _chain(iterable, ctx, res) {
        res = res || [];
        ctx = ctx || this;
        /**
         * Расширяем массив результатов методом для получения результата предыдущего шага
         */
        !res.last && (res.last = function() { return this.length? this[this.length - 1]: null; });
        var defer = vow.defer(),
            len = iterable.length;

        if (!len || !Array.isArray(iterable)) {
            defer.resolve(res);
            return defer.promise();
        }

        (function wrapper() {
            //TODO: произвести замеры, может есть смысл использовать .reverse()+.pop()
            _async(iterable.shift(), ctx, res).then(
                function (result) {
                    res.push(result);
                    iterable.length? wrapper(): defer.resolve(res);
                },
                function(err) { defer.reject(err); },
                function(val) { defer.notify(val); }
            );
        })();

        return defer.promise();
    }

    /**
     * Перебор всех элементов массива или полей объекта
     * @param {(Array|Object)} iterable - перебираемый элемент
     * @param {Function} [func=_emptyFn] - функция-итератор
     * @param {*} [ctx=this] - контекст выполнения @func
     * @private
     */
    function _forEach(iterable, func, ctx) {
        func = func || _emptyFn;
        ctx = ctx || this;
        if (Array.isArray(iterable)) {
            try {
                iterable.forEach(function (item, num, arr) { if (func.call(ctx, item, num, arr)) throw _stopIteration; });
            } catch (e) {
                if (e != _stopIteration) throw e;
            }
        }
        else {
            for (var iter in iterable) {
                if (iterable.hasOwnProperty(iter) && func.call(ctx, iterable[iter], iter, iterable))
                    break;
            }
        }
    }

    /**
     * Асинхронный перебор всех элементов массива
     * @param {Array} iterable - перебираемый массив
     * @param {Function} [func=_emptyAsyncFn] - функция-итератор
     * @param {*} [ctx=this] - контекст выполнения @func
     * @returns {Promise}
     * @private
     */
    function _forEachChain(iterable, func, ctx) {
        var funcs = [];
        func = func || _emptyAsyncFn;
        ctx = ctx || this;
        if (!iterable.length || !Array.isArray(iterable)) return _chain([], ctx);
        _forEach(iterable, function (item, num, arr) {
            funcs.push(function (defer) { func.call(ctx, defer, item, num, arr); });
        }, this);
        return _chain(funcs, ctx);
    }

    /**
     * Поиск элементов, удовлетворяющих условию
     * @param {(Array|Object)} iterable - перебираемый массив или объект
     * @param {Function} [func=_emptyFn] - функция-итератор
     * @param {*} [ctx=this] - контекст выполнения @func
     * @param {Boolean} [one=false] - искать только первое совпадение или все
     * @returns {(*|*[])} для @one=true первый элемент, удовлетворяющий условию;
     *                    для @one=false все элементы, удовлетворяющие условию
     * @private
     */
    function _find(iterable, func, ctx, one) {
        var result;
        !one && (result = []);
        _forEach(iterable, function (item) {
            if (func.call(ctx, item)) {
                one?
                    (result = item):
                    (result.push(item));
                if (one) return true;
            }
        }, this);
        return result;
    }

    return {
        async : _async,
        chain : _chain,
        forEach : _forEach,
        forEachChain : _forEachChain,
        find : _find,
        findOne : function (iterable, func, ctx) { return _find(iterable, func, ctx, true) }
    }
};