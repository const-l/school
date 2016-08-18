/**
 * Schema Route
 * Created by Constantine on 21.07.2016.
 */
module.exports = exports = function Route(mongoose) {

    // var Schema = mongoose.Schema;
    var Schema = mongoose.Schema,
        cache = require('../../server/cache')();

    var Route = new Schema({
            Path    : { type : String, required : true },
            Caption : { type : String },
            Block   : { type : String, required : true },
            Type    : { type : String, required : true, enum : ['Page', 'List'], default : 'Page' },
            Pages   : [{ type : Schema.Types.ObjectId, ref : 'Page' }]
        // }),
        // cache = null;
        });

    Route.statics.GetRoutes = function (next) {
        // if (cache) next.resolve? next.resolve(cache): next(cache);
        if (cache.exists('Route')) next.resolve? next.resolve(cache.get('Route')): next(cache.get('Route'));
        else this.find({}, function (err, docs) {
            var result = {};
            if (err) {
                if (next.reject) return next.reject(err);
                else throw err;
            }
            docs && docs.forEach(function (item) {
                result[item.Path] = item;
            });
            cache.set('Route', result);
            next.resolve? next.resolve(result): next(result);
        })
    };

    return mongoose.model('Route', Route);
};