var mongoose = require('mongoose'),
    schemas  = require('./schemas'),
    config   = require('../server/config'),
    dbHelper = require('../server/utils/dbHelper')(schemas);

module.exports = {
    connect : function (defer) {
        mongoose.connection.readyState === mongoose.STATES.connected?
            defer.resolve():
            mongoose.connection.on('open', function () { defer.resolve(); });
    },
    dropDB : function (defer) {
        mongoose.connection.db.dropDatabase(function(err) { err? defer.reject(err): defer.resolve(); });
    },
    fromDB : function (defer) {
        dbHelper.fromDBToFile(defer, config.mongoose.dataFilePath, ['User', 'Page', 'Route', 'Menu']);
    },
    toDB : function (defer) {
        dbHelper.fromFileToDB(defer, config.mongoose.dataFilePath);
    }
};
