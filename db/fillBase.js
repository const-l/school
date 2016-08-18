var mongoose = require('mongoose'),
    schemas  = require('./schemas'),
    config   = require('../server/config'),
    utils    = require('../server/utils')({}),
    dbHelper = require('../server/utils/dbHelper')(schemas);

var connect = function (defer, res) {
        mongoose.connection.readyState === mongoose.STATES.connected?
            defer.resolve():
            mongoose.connection.on('open', function () { defer.resolve(); });
    },
    dropDB = function (defer) {
        mongoose.connection.db.dropDatabase(function(err) { err? defer.reject(err): defer.resolve(); });
    };

utils.chain([connect, dropDB,
    function (defer) {
        dbHelper.fromFileToDB(defer, config.mongoose.dataFilePath);
    }
]).then(
    function () { mongoose.disconnect(); },
    function (err) { console.error(err); mongoose.disconnect(); }
);
