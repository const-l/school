var log = require('../server/log'),
    base = require('./base'),
    utils = require('../server/utils')({});

utils
    .chain([base.connect, base.dropDB, base.toDB])
    .then(
        function () { log.info('Data loaded'); },
        function (err) { log.error(err); }
    );