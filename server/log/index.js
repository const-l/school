var winston = require('winston');
winston.emitErrs = true;

var timestamp = function() {
    var d = new Date();
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' +
        d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds();
};

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './server/log/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            timestamp : timestamp
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp : timestamp
        })
    ],
    exitOnError: false
});

module.exports = logger;