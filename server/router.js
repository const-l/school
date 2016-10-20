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

var methods = [
    schemas.Menu.GetMenus.bind(schemas.Menu),
    schemas.Menu.GetSidebars.bind(schemas.Menu),
    schemas.Route.GetRoutes.bind(schemas.Route),
    function () { return dataModel.Static.load(); }
];

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

router.get('/clear_cache', isAuthUser, isAdminUser, function (req, res) {
    cache.flushAll();
    res.redirect('/');
});

router.route('*')
    .all(function (req, res, next) {
        utils.chain(methods, this).then(
            function() { next(); },
            function(err) { res.sendStatus(500); }
        );
    })
    .get(function (req, res, next) {
            var id = req.query.id,
                mode = !!req.query.mode;
            if (id || mode) return next();
            dataModel.Content.getByPath({ path : req.path, page : req.query.page }).then(
                function (result) {
                    if (!result || !result.last) {
                        return res.sendStatus(500);
                    }
                    result = result.last();
                    var doc = result.doc,
                        dir = result.dir;
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
                            carousel : (cache.get(config.static.STATIC_DATA_KEY) || {}).carousel,
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