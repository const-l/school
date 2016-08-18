/**
 * Created by Constantine on 25.07.2016.
 */
module.exports = exports = function (schemas) {

    var fs = require('fs'),
        utils = require('./index')();

    /**
     * Чтение данных из файла и последовательное асинхронное сохранение их в БД
     * @param {vow.defer} defer
     * @param {String} filePath - путь к файлу
     * @private
     */
    function _fromFileToDB(defer, filePath) {
        fs.readFile(filePath, function (err, data) {
            if (err) return defer.reject(err);
            try { data = JSON.parse(data) }
            catch (e) { return defer.reject(e); }
            /**
             * Функция сохранения данных в ДБ
             * @param {Object} data - Данные
             * @param {String} schema - Имя схемы
             * @returns {Function} асинхронная функция сохранения
             * @private
             */
            var _save = function (data, schema) {
                return function(defer) {
                    try {
                        (new schemas[schema](data))
                            .save(function (err) {
                                err ? defer.reject(err) : defer.resolve();
                            });
                    } catch (e) {
                        defer.reject(e);
                    }
                };
            };
            var funcs = [];
            data.forEach(function (item) {
                utils.forEach(item, function (data, schema) {
                    if (Array.isArray(data)) {
                        utils.forEach(data, function (rec) {
                            funcs.push(_save(rec, schema));
                        }, this);
                    }
                    else {
                        funcs.push(_save(data, schema));
                    }
                }, this);
            });
            utils.chain(funcs, this).then(
                function() { defer.resolve(); },
                function(err) { defer.reject(err) }
            );
        });
    };
    /**
     * Чтение данных из БД и сохранение их в файл
     * @param {vow.defer} defer
     * @param {string} filePath - путь к файлу
     * @param {(string|object)[]} names - сохраняемые схемы
     * @private
     */
    function _fromDBToFile(defer, filePath, names) {
        /**
         * Выборка данных из БД
         * @param {vow.defer} defer - promise
         * @param {(string|Object)} schema - имя схемы, либо объект c именем и фильтрами
         * @param {string} schema.name - имя схемы
         * @param {Object} schema.filter - хэш фильтрации схемы
         */
        var func = function (defer, schema) {
                var filter = (schema || {}).filter || {};
                schema = typeof schema === 'string' || schema instanceof String?
                    schema: (schema || {}).name;
                schemas[schema].find(filter, function (err, docs) {
                    if (err) return defer.reject(err);
                    var item = {};
                    item[schema] = docs;
                    data.push(item);
                    defer.resolve();
                });
            },
            data = [];
        utils.forEachChain(names, func).then(
            function () {
                fs.writeFile(filePath, JSON.stringify(data, null, 2), function (err) {
                    err? defer.reject(err): defer.resolve();
                });
            },
            function (err) { defer.reject(err); }
        );
    };

    return {
        fromFileToDB : _fromFileToDB,
        fromDBToFile : _fromDBToFile
    }
};