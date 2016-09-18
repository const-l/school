var express = require('express'),
    router = express.Router(),
    render = require('./render'),
    config = require('./config'),
    url = require('url'),
    utils = require('./utils')({}),
    vow = require('vow'),
    cache = require('./cache')(),
    schemas = require('../db/schemas'),
    fs = require('fs'),
    path = require('path'),
    multer = require('multer');

var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = './public/uploads' + req.params[0] + '/';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    upload = multer({ storage : storage });

var isAuthUser = function (req, res, next) {
        (req.session.user || {}).Id?
            next(): next('route');
    },
    isAdminUser = function (req, res, next) {
        (req.session.user || {}).IsAdmin?
            next(): next('route');
    },
    forbiddenSend = function (req, res) {
        res.sendStatus(403);
    };

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

router.post('*/save/:id', isAuthUser, isAdminUser, function (req, res) {
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
    utils.async(function (defer) {
        cache.flush(cache.find(path + ".*"));
        schemas.Page.saveContent(id, content, user, defer);
    }).then(
        function () { res.redirect(path); },
        function (err) {
            res.status(500).send(err);
        }
    );
});
router.post('*/save/:id', forbiddenSend);

router.post('*/upload', [
    isAuthUser,
    isAdminUser,
    upload.single('file'),
    function (req, res, next) {
        cache.flush(cache.find(req.url + '.*'));
        res.status(200).end();
    }
]);
router.post('*/upload', forbiddenSend);

router.get('*/upload', isAuthUser, isAdminUser, function (req, res, next) {
    if (!req.xhr) return next();
    var dir = './public/uploads' + req.params[0] + '/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        render(req, res, { files : [] }, { block : 'file', elem : 'list' });
    }
    else {
        fs.readdir(dir, function (err, files) {
            if (err) res.sendStatus(500);
            render(req, res, {
                    files :
                        files
                            .filter(function (file) {
                                return fs.statSync(path.join(dir, file)).isFile();
                            })
                            .map(function (file) {
                                return '/uploads' + req.params[0] + '/' + file;
                            })
                },
                { block : 'file', elem : 'list' });
        });
    }
});
router.get('*/upload', forbiddenSend);

///TODO переработать на прослойки, чтобы все роуты обрабатывались однотипно
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