require('../server/utils')()
    .async(function (defer) {
        require('fs').readFile('./production/production.json', function (err, data) {
            if (err) return defer.reject(err);
            try {
                data = JSON.parse(data);
                Object.assign(process.env, data);
            }
            catch (e) { return defer.reject(e); }
            defer.resolve();
        });
    }, this).then(
        function () {
            require('../server/app');
        },
        function (err) {
            console.error('Start error', err.stack);
            console.trace('server stack');
        }
    );