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
    //log = require('./log'),

    vow = require('vow'),
    utils = require('./utils')({}),
    cache = require('./cache')(),
    schemas = require('../db/schemas'),

    router = require('./router'),
    staticFolder = config.public;


app
    .disable('x-powered-by')
    .set('handle', process.env.PORT || config.express.port)
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
    .use(slashes());

vow.all([
    utils.async(function (defer) { schemas.Menu.GetMenus(defer); }, this),
    utils.async(function (defer) { schemas.Menu.GetSidebars(defer); }, this),
    utils.async(function (defer) { schemas.Route.GetRoutes(defer); }, this)
]).then(
    function () { start(); },
    function (err) { start(err); }
);

function start(err) {
    err? app.all('*', function (req, res) { res.send(500); }): app.use(router);
    app.listen(app.get('handle'), function() {
        console.info('start worker: ' + process.env.WORKER_ID);
    console.info('NODE_ENV: ' + process.env.NODE_ENV);
    console.info('start PID: ' + process.pid);
    console.info('Express server listening on port ' + app.get('handle'));
});
}