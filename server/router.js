var express = require('express'),
    router = express.Router(),
    render = require('./render'),
    config = require('./config'),
    url = require('url'),
    utils = require('./utils')({}),
    vow = require('vow'),
    cache = require('./cache')(),
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
                slice = ((req.query.page || 1) - 1) * -10;
            if (id) return next();
            schemas.Route
                .findOne({ Path : req.path })
                .populate({
                    path : 'Pages',
                    select: 'Content',
                    slice : [slice, 10]
                })
                .exec(function (err, doc) {
                    if (err) return next(err);
                    if (doc) {
                        render(req, res, {
                            Menus : cache.get('Menu'),
                            Sidebars : cache.get('Sidebar'),
                            main : doc.Pages.map(function (item) {
                                return Object.assign({
                                    block : doc.Block,
                                    edit_id : item._id.toString()
                                }, JSON.parse(item.Content || '[]'));
                            })
                        });
                    }
                    else next('route');
                });
        },
        function (req, res, next) {
            var route = (cache.get('Route') || {})[req.path],
                id = req.query.id,
                mode = !!req.query.mode;
            if (!route) return next('route');
            if (mode) return next();
            schemas.Page.findById(id, 'Content', function (err, doc) {
                if (err) return next(err);
                if (doc) {
                    render(req, res, {
                        Menus : cache.get('Menu'),
                        Sidebars : cache.get('Sidebar'),
                        main : Object.assign({ block : route.Block }, JSON.parse(doc.Content || '[]'))
                    });
                }
                else next('route');
            });
        })
    .all(isAuthUser, isAdminUser)
    .get(function (req, res, next) {
        var route = (cache.get('Route') || {})[req.path],
            id = req.query.id;
        schemas.Page.findById(id, 'Content', function (err, doc) {
            if (err) return next(err);
            if (doc) {
                render(req, res, {
                    Menus : cache.get('Menu'),
                    Sidebars : cache.get('Sidebar'),
                    main : Object.assign({
                        block : 'editor',
                        mods : { page : route.Block },
                        id : id
                    }, JSON.parse(doc.Content || '[]'))
                });
            }
            else next('route');
        });
    })
    .post(function (req, res) {
        var user = req.session.user,
            body = req.body,
            content = '',
            id = req.query.id,
            path = req.params[0] || '/';
        try {
            content = JSON.stringify(body);
        }
        catch (e) {
            res.sendStatus(500);
        }
        utils.async(function (defer) {
            cache.flush(cache.find(path + ".*"));
            schemas.Page.saveContent(id, content, user, defer);
        }).then(
            function () { res.redirect(path); },
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