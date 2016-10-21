var path = require('path'),
    express = require('express'),
    app = express(),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    session = require('express-session'),
    slashes = require('connect-slashes'),

    config = require('./config'),
    utils = require('./utils')({}),
    cache = require('./cache')(),
    router = require('./router'),
    log = require('./log'),

    staticFolder = config.public;


app
    .disable('x-powered-by')
    .set('handle', config.express.port)
    .use(favicon(path.join(staticFolder, 'favicon.ico')))
    .use(serveStatic(staticFolder))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended : true }))
    .use(cookieParser())
    .use(session({
        secret: config.session.secret,
        resave: false,
        saveUninitialized: true
    }))
    .use(slashes())
    .use(router)
    .listen(app.get('handle'), function() {
        log.info('start worker: ' + process.env.WORKER_ID);
        log.info('NODE_ENV: ' + process.env.NODE_ENV);
        log.info('start PID: ' + process.pid);
        log.info('Express server listening on port ' + app.get('handle'));
    });