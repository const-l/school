var express = require('express'),
    router = express.Router(),
    render = require('../render'),
    cache = require('../cache')(),
    fs = require('fs'),
    path = require('path'),
    multer = require('multer');

var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = './public/uploads' + req.params[0] + '/';
            fs.stat(dir, function (err) {
                if (err) {
                    if (err.code === "ENOENT") {
                        fs.mkdir(dir, function (err) {
                            err? cb(err): cb(null, dir);
                        });
                    }
                    else cb(err);
                }
                else cb(null, dir);
            })
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    upload = multer({ storage : storage });

router.route('*/upload')
    .get(function (req, res, next) {
        if (!req.xhr) return next();
        var dir = './public/uploads' + req.params[0] + '/';
        fs.stat(dir, function (err, stat) {
            if (err) {
                if (err.code === "ENOENT") {
                    fs.mkdir(dir, function (err) {
                        if (err) res.sendStatus(500);
                        else render(req, res, {}, { block : 'file', elem : 'list' });
                    });
                }
                else res.sendStatus(500);
            }
            else if (stat.isDirectory()) {
                fs.readdir(dir, function (err, files) {
                    if (err) return res.sendStatus(500);
                    render(req, res, {},
                        files
                            .filter(function (file) {
                                return fs.statSync(path.join(dir, file)).isFile();
                            })
                            .map(function (file) {
                                return {
                                    block : 'file',
                                    elem : 'list-item',
                                    content : '/uploads' + req.params[0] + '/' + file
                                };
                            }));
                });
            }
            else res.sendStatus(500);
        });
    })
    .post(upload.single('file'),
        function (req, res) {
            cache.flush(cache.find(req.url + '.*'));
            res.sendStatus(200);
        })
    .delete(function (req, res, next) {
        if (!req.xhr) return next();
        var fileName = './public' + (req.body || {}).path;
        fs.stat(fileName, function (err, stat) {
            if (err || !stat.isFile()) return res.sendStatus(400);
            fs.unlink(fileName, function (err) {
                if (err) return next(err);
                cache.flush(cache.find(req.url + '.*'));
                res.sendStatus(200);
            });
        });
    });

module.exports = router;