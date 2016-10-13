/**
 * Created by Constantine on 13.10.2016.
 */

var fs = require('fs'),
    Path = require('path'),
    utils = require('./index')();

/**
 * Проверяет существует ли папка, если нет, то создает ее
 * @param {string} path - путь
 * @returns {Function}
 * @throws {'is not a folder'} - по задонному пути НЕ папка
 * @throws {Error} - внутренняя ошибка из {@link fs}
 * @private
 */
var _mkdir = function (path) {
    return function (defer) {
        fs.stat(path, function (err, stat) {
            if (err) {
                if (err.code !== "ENOENT") return defer.reject(err);
                fs.mkdir(path, function (err) {
                    err ? defer.reject(err) : defer.resolve();
                });
            }
            else {
                !stat.isDirectory() ?
                    defer.reject(new Error(path + ' - is not a folder')) :
                    defer.resolve();
            }
        });
    };
};

module.exports = {
    /**
     * Рекурсивно создает папку по пути, если она еще не существует
     * @param {string} path - путь
     * @returns {Promise}
     * @throws {'is not a folder'} - по задонному пути НЕ папка
     * @throws {Error} - внутренняя ошибка из {@link fs}
     */
    mkdir : function (path) {
        return utils.async(function (defer) {
            fs.stat(path, function (err, stat) {
                if (err) {
                    if (err.code !== "ENOENT") return defer.reject(err);
                    var dirs = [];
                    path.split(Path.sep).reduce(function (prev, curr) {
                        var dir = Path.join(prev, curr);
                        dirs.push(dir);
                        return dir;
                    });
                    utils
                        .chain(dirs.map(function(dir) { return _mkdir(dir); }, this))
                        .then(
                            function() { defer.resolve(); },
                            function(err) { defer.reject(err); }
                        );
                }
                else {
                    !stat.isDirectory() ?
                        defer.reject(new Error(path + ' - is not a folder')) :
                        defer.resolve();
                }
            });
        });
    }
};