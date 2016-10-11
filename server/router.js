var express = require('express'),
    router = express.Router(),
    render = require('./render'),
    config = require('./config'),
    url = require('url'),
    utils = require('./utils')({}),
    vow = require('vow'),
    cache = require('./cache')(),
    dataModel = require('./data'),
    schemas = require('../db/schemas'),
    upload = require('./utils/uploadRouter');

var isAuthUser = function (req, res, next) {
        (req.session.user || {}).Id? next(): next({ forbidden : true });
    },
    isAdminUser = function (req, res, next) {
        (req.session.user || {}).IsAdmin? next(): next({ forbidden : true });
    },
    forbiddenSend = function (req, res) {
        res.sendStatus(403);
    };

router.all('*', [
    function (req, res, next) {
        try {
            schemas.Menu.GetMenus(function() { next(); });
        }
        catch (e) {
            res.sendStatus(500);
        }
    },
    function (req, res, next) {
        try {
            schemas.Menu.GetSidebars(function() { next(); });
        }
        catch (e) {
            res.sendStatus(500);
        }
    },
    function (req, res, next) {
        try {
            schemas.Route.GetRoutes(function() { next(); });
        }
        catch (e) {
            res.sendStatus(500);
        }
    }
]);

router.post('/login', function (req, res) {
    utils.async(function (defer) {
        schemas.User.getAuthUser(req.body, defer);
    }).then(
        function (result) {
            var data = { success : false };
            if (result) {
                req.session.user = {
                    Id : result._id,
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

router.all('*/upload', isAuthUser, isAdminUser);
router.use(upload);

router.route('*')
    .get(function (req, res, next) {
            var id = req.query.id,
                mode = !!req.query.mode,
                config = { path : req.path, page : req.query.page };
            if (id || mode) return next();
            dataModel.Content.getByPath(config).then(
                function (result) {
                    if (!result || !result.length || result.length < 2) {
                        return res.sendStatus(500);
                    }
                    var doc = result[0],
                        dir = result[1];
                    if (doc) {
                        var main = doc.Pages.map(function (item) {
                            return Object.assign({
                                block : doc.Block,
                                mods : { view : 'list' },
                                Id : item._id.toString()
                            }, JSON.parse(item.Content || '[]'));
                        });
                        !main.length && main.push({ block : 'data', elem : 'empty' });
                        main.unshift({ block : 'button', mods : { type : 'add' }});
                        (dir.prev || dir.next) && main.push({ block : 'directions', config : dir });
                        render(req, res, {
                            Menus : cache.get('Menu'),
                            Sidebars : cache.get('Sidebar'),
                            main : main
                        });
                    }
                    else next('route');
                },
                function (err) { next(err); }
            );
        },
        function (req, res, next) {
            var route = (cache.get('Route') || {})[req.path],
                id = req.query.id,
                mode = !!req.query.mode;
            if (!route) return next('route');
            if (mode) return next();
            dataModel.Content.getById(id).then(
                function (doc) {
                    if (doc) {
                        render(req, res, {
                            Menus : cache.get('Menu'),
                            Sidebars : cache.get('Sidebar'),
                            main : Object.assign({ block : route.Block }, JSON.parse(doc.Content || '[]'))
                        });
                    }
                    else next('route');
                },
                function (err) { next(err); }
            );
        })
    .all(isAuthUser, isAdminUser)
    .get(function (req, res, next) {
        var route = (cache.get('Route') || {})[req.path],
            id = req.query.id || null;
        dataModel.Content.getById(id).then(
            function (doc) {
                !doc && (id = dataModel.genId());
                render(req, res, {
                    Menus : cache.get('Menu'),
                    Sidebars : cache.get('Sidebar'),
                    main : Object.assign({
                        block : 'editor',
                        mods : { page : route.Block },
                        id : id
                    }, JSON.parse((doc || {}).Content || '[]'))
                });
            },
            function(err) { next(err) }
        );
    })
    .post(function (req, res) {
        var content = '',
            path = req.params[0] || '/';
        try {
            content = JSON.stringify(req.body);
        }
        catch (e) {
            return res.sendStatus(500);
        }
        dataModel.Content.save({ id : req.query.id, content : content, user : req.session.user, path : path }).then(
            function () {
                cache.flush(cache.find(path + '.*'));
                res.redirect(path);
            },
            function () {
                res.sendStatus(500);
            }
        );
    })
    .delete(function (req, res, next) {
        if (!req.xhr) return next();
        var id = (req.body || {}).id || '',
            path = req.params[0] || '/';
        if (!id) next();
        dataModel.Content.remove({ id : id, path : path }).then(
            function () {
                cache.flush(cache.find(path + '.*'));
                res.sendStatus(200);
            },
            function () {
                res.sendStatus(500);
            }
        );
    });

router.all('*', function (req, res) {
    res.status(404);
    render(req, res, {
        Menus : cache.get('Menu'),
        title: 'Страница не найдена',
        'main-content' : { block: 'empty' }
    });
});

router.use(function (err, req, res, next) {
    if (err.forbidden) return forbiddenSend(req, res);
    else next();
});

module.exports = router;