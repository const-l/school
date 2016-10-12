var fs = require('fs');
require('../server/utils')()
    .chain([
        function (defer) {
            fs.readFile('./production/production.json', function (err, data) {
                if (err) return defer.reject(err);
                try {
                    data = JSON.parse(data);
                    Object.assign(process.env, data);
                }
                catch (e) { return defer.reject(e); }
                defer.resolve();
            });
        },
        function (defer) {
            require('enb')
                .make()
                .then(
                    function() { defer.resolve(); },
                    function() { defer.reject(arguments); }
                );
        }
    ], this)
    .then(
        function () {
            require('../server/app');
        },
        function () {
            /// TODO. Need logger
            console.error(arguments);
        }
    );