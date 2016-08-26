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

router.post('/login', function (req, res) {
    utils.async(function (defer) {
        schemas.User.getAuthUser(req.body, defer);
    }).then(
        function (result) {
            var data = { success : false };
            if (result) {
                req.session.user = {
                    Name : result.Name,
                    IsAdmin: result.IsAdmin
                };
                data.success = true;
            }
            res.send(JSON.stringify(data));
        }
    );
});

router.post('/logout', function (req, res) {
    res.send(JSON.stringify({ success: (delete req.session.user )}));
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

router.all('*', function (req, res) {
    res.status(404);
    render(req, res, {
        Menus : cache.get('Menu'),
        title: 'Страница не найдена',
        'main-content' : { block: 'empty' }
    });
});

module.exports = router;