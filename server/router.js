var express = require('express'),
    router = express.Router(),
    render = require('./render'),
    config = require('./config'),
    url = require('url'),
    utils = require('./utils')({}),
    vow = require('vow'),

    cache = require('./cache')(),
    
    schemas = require('../db/schemas')/*,

    env = process.env.NODE_ENV,
    isDev = env === 'development',
    useCache = !isDev,

    navigation = {}*/;

/*
router.all('*', function (req, res, next) {
    var ignoreCache = req.ignoreCache,
        navigation = config.settings.navigation;
    if (ignoreCache || !navigation) {
        mongoose.Navigation.all(function (err, data) {
            if (err) {
                console.error(err);
                return res.send(500);
            }
            config.settings.navigation = data;
            next();
        })
    }
    else next();
});

router.get('/', function (req, res) {
    render(req, res, {
        /!*main: 'This text in main in home page'*!/
        main : [{
            caption : 'Welcome!',
            data : 'This text in main in home page'
        }]
    })
});

router.get('/page/:path', function (req, res, next) {
    var url = (req.params && req.params.path || '').replace(/\/+$/, ''), found, data, nav = config.settings.navigation;
    if (!url) return next();
    found = utils.findOne(nav, function (item) { return item.path === '/' + url; }, this);
    found && (data = found.article.length? found.article: [{ data : 'Этот раздел пока пуст' }]);
    if (!data) return next();
    render(req, res, { main : data });
});
*/

function getRequiredData() {
    return vow.all([
        utils.async(function (defer) { schemas.Menu.GetMenus(defer); }, this),
        utils.async(function (defer) { schemas.Menu.GetSidebars(defer); }, this),
        utils.async(function (defer) { schemas.Route.GetRoutes(defer); }, this)
    ]);
}

router.get('*', function (req, res, next) {
    getRequiredData().then(
        function() { next(); },
        function(err) { next(err); }
    );
});

router.get('*', function (req, res, next) {
    if (cache.get('Route')[req.path]) {
        render(req, res, {
            Menus : cache.get('Menu'),
            Sidebars : cache.get('Sidebar')
        });
    }
    else next();
});

module.exports = router;