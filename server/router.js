var express = require('express'),
    router = express.Router(),
    render = require('./render'),
    config = require('./config'),
    url = require('url'),
    utils = require('./utils')({}),
    vow = require('vow'),

    cache = require('./cache')(),
    
    schemas = require('../db/schemas');

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
    var route = (cache.get('Route') || {})[req.path];
    if (route) {
        schemas.Page.find({_id : {$in : route.Pages}}, function (err, docs) {
            if (err) return next(err);
            if (docs && docs.length) {
                render(req, res, {
                    Menus : cache.get('Menu'),
                    Sidebars : cache.get('Sidebar'),
                    main : docs.map(function(item) {
                        var result = {
                            caption : item.Caption,
                            content : item.Preview
                        };
                        docs.length == 1 && (result.content = item.Content);
                        return result;
                    })
                });
            }
            //TODO: обработать пустые страницы
            else next();
        });
    }
    else next();
});

module.exports = router;