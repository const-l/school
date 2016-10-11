var express = require('express'),
    router = express.Router(),
    render = require('../render'),
    cache = require('../cache')(),
    config = require('../config'),
    utils = require('./index')(),
    fs = require('fs'),
    path = require('path'),
    multer = require('multer');

var mkdir = function (dir) {
        return function (defer) {
            fs.stat(dir, function (err, stat) {
                if (err) {
                    if (err.code === "ENOENT")
                        fs.mkdir(dir, function (err) {
                            err ? defer.reject(err) : defer.resolve();
                        });
                    else defer.reject(err);
                }
                else if (stat.isDirectory()) defer.resolve();
                else defer.reject('Inner error');
            });
        }
    },
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!req.query.id) return cb('Empty id');
            var dir = path.join(config.public, 'uploads', req.params[0], req.query.id);
            fs.stat(dir, function (err) {
                if (err && err.code === "ENOENT") {
                    var paths = [];
                    dir.split(path.sep).reduce(function (prev, curr) {
                        var dir = path.join(prev, curr);
                        paths.push(dir);
                        return dir;
                    });
                    utils.chain(paths.map(function(item) { return mkdir(item); }), this)
                        .then(
                            function() { cb(null, dir); },
                            function(err) { cb(err); }
                        );
                }
                else cb(err, dir);
            });
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    upload = multer({ storage : storage });

router.route('*/upload')
    .get(function (req, res, next) {
        if (!req.xhr || !req.query.id) return next();
        var dir = path.join(config.public, 'uploads', req.params[0], req.query.id);
        fs.stat(dir, function (err, stat) {
            if (err) {
                if (err.code === "ENOENT") render(req, res, {}, { block : 'file', elem : 'list' });
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
                                    content : '/uploads' + req.params[0] + '/' + req.query.id + '/' + file
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
        var fileName = path.join('public', (req.body || {}).path);
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