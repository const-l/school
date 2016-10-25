var fs = require('fs'),
    log = require('../server/log'),
    base = require('./base'),
    utils = require('../server/utils')({}),
    config   = require('../server/config');

utils
    .chain([
        base.connect,
        base.fromDB,
        function (defer) {
            fs.readFile(config.mongoose.dataFilePath, function (err, data) {
                if (err) return defer.reject(err);
                try { data = JSON.parse(data); }
                catch (e) { return defer.reject(e); }
                fs.writeFile(config.mongoose.dataFilePath, JSON.stringify(data, null, 0), function (err) {
                    err? defer.reject(err): defer.resolve();
                });
            });
        },
        base.disconnect
    ]).then(
        function () { log.info('Data loaded to file'); },
        function (err) { log.error(err); }
    );