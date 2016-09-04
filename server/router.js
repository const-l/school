var express = require('express'),
    router = express.Router(),
    render = require('./render'),
    config = require('./config'),
    url = require('url'),
    utils = require('./utils')({}),
    vow = require('vow'),

    cache = require('./cache')(),
    
    schemas = require('../db/schemas');

///TODO: проработать нормально обработку ошибок, сделать кроме 404 еще минимум 401 и 500

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

router.post('*/save/:id', function (req, res, next) {
    var user = req.session.user || {},
        body = req.body,
        content = '',
        id = req.params.id,
        path = req.params[0] || '/';
    try {
        content = JSON.stringify(body);
    }
    catch (e) {
        res.status(500).send('Inner error');
    }
    if (user.Id && user.IsAdmin) {
        utils.async(function (defer) {
            cache.flush(cache.find(path + ".*"));
            schemas.Page.saveContent(id, content, user, defer);
        }).then(
            function () { res.redirect(path); },
            function (err) {
                res.status(500).send(err);
            }
        );
    }
    //TODO: проработать переброс с 403
    else next();
});

router.get('*', function (req, res, next) {
    var isEditMod = !!req.query['edit_mode'],
        queryId = req.query.id || '',
        user = req.session.user || {};
    if (isEditMod && !user.IsAdmin) return res.redirect(req._parsedUrl.pathname);
    var route = (cache.get('Route') || {})[req.path];
    if (route) {
        schemas.Page.find({_id : {$in : route.Pages}}, 'Content', function (err, docs) {
            if (err) return next(err);
            if (docs && docs.length) {
                render(req, res, {
                    Menus : cache.get('Menu'),
                    Sidebars : cache.get('Sidebar'),
                    main : docs.map(function(item) {
                        var _id = item._id.toString(),
                            result = Object.assign({ block : route.Block }, JSON.parse(item.Content || '[]'));
                        /**
                         * Если редактирование текущей записи, блок становится "editor" с модификатором в значении
                         * имени страницы, иначе просто проброс id записи в БД
                         */
                        if (isEditMod && queryId === _id) {
                            result.block = 'editor';
                            result.mods = {page: route.Block};
                            result.id = _id;
                        }
                        else result.edit_id = _id;
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