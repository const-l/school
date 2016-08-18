require('enb').make().then(function () {
    if (process.env.START_APP)
        require('./server/app');
    else console.info('Project built');
}, function () {
    console.error(arguments);
});