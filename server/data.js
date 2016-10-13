var mongoose = require('mongoose'),
    schemas = require('../db/schemas'),
    fs = require('fs'),
    Path = require('path'),
    Fs = require('./utils/fs'),

    config = require('./config'),
    cache = require('./cache')(),
    utils = require('./utils')();

const CAROUSEL_KEY = 'carousel_images';

var content = {

    getByPath: function (opt) {
        opt = opt || {};
        var path = opt.path || '/',
            page = opt.page || 1,
            limit = opt.limit || config.mongoose.pageLimit,
            skip = opt.skip || (page - 1) * limit;
        return utils.chain([
            function (defer) {
                if (cache.exists(CAROUSEL_KEY)) return defer.resolve(cache.get(CAROUSEL_KEY));
                Fs.mkdir(config.settings.carousel)
                    .then(
                        function () {
                            fs.readdir(config.settings.carousel, function (err, files) {
                                if (err) return defer.reject(err);
                                cache.set(
                                    CAROUSEL_KEY,
                                    files.filter(function(file) {
                                        return fs.statSync(Path.join(config.settings.carousel, file)).isFile();
                                    }))? defer.resolve(cache.get(CAROUSEL_KEY)): defer.reject(new Error());
                            });
                        },
                        function (err) { defer.reject(err); }
                    );
            },
            function (defer) {
                schemas.Route
                    .findOne({Path: path})
                    .populate({
                        path: 'Pages',
                        select: 'Content',
                        options: {
                            limit: limit,
                            sort: {ModifiedOn: -1},
                            skip: skip
                        }
                    })
                    .exec(function (err, doc) {
                        err? defer.reject(err): defer.resolve(doc);
                    });
            },
            function (defer) {
                schemas.Route.findOne({Path: path}).populate('Pages', '_id').exec(function (err, doc) {
                    if (err) return defer.reject(err);
                    var res = {};
                    if (doc) {
                        page > 1 && (res.prev = {url: path + '?page=' + (page - 1)});
                        skip + limit < (doc.Pages || []).length && (res.next = {url: path + '?page=' + (page + 1)});
                    }
                    defer.resolve(res);
                });
            }
        ], this);
    },
    getById: function (id) {
        return utils.async(function (defer) {
            schemas.Page.findById(id, 'Content', function (err, doc) {
                err? defer.reject(err): defer.resolve(doc);
            })
        }, this);
    },
    save: function (opt) {
        opt = opt || {};
        var id = opt.id || '',
            content = opt.content || '',
            user = opt.user || {},
            path = opt.path || '';
        return utils.chain([
            function (defer) {
                schemas.Page.findById(id, function (err, doc) {
                    if (err) return defer.reject(err);
                    !doc && (doc = new schemas.Page({ Author : user.Id }));
                    doc.Content = content;
                    doc.Modifier = user.Id;
                    var res = { new : doc.isNew };
                    doc.save(function (err, rec) {
                        err? defer.reject(err): defer.resolve(Object.assign(res, { rec : rec }));
                    })
                })
            },
            function (defer, res) {
                if (!path || !res.last().new) return defer.resolve();
                var page = res.last().rec;
                schemas.Route.findOne({ Path : path }, function (err, rec) {
                    if (err) return defer.reject(err);
                    if (rec) {
                        rec.Pages.push(page);
                        rec.save(function (err, rec) {
                            err? defer.reject(err): defer.resolve(rec);
                        });
                    }
                    else defer.resolve();
                });
            }
        ]);
    },
    remove: function (opt) {
        opt = opt || {};
        var id = opt.id || '',
            path = opt.path || '';
        return utils.async(function (defer) {
            if (!id) return defer.reject();
            schemas.Page.remove({ _id : id }, function (err) {
                if (err) return defer.reject(err);
                if (!path) defer.resolve();
                else schemas.Route.update({ Path : path }, { pull : { Pages : id }}, function (err) {
                    err? defer.reject(err): defer.resolve();
                });
            });
        }, this);
    }

};

module.exports = {
    genId : function() { return mongoose.Types.ObjectId().toString(); },
    Content : content
};