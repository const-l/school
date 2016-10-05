/**
 * Schema Menu
 * Created by Constantine on 22.07.2016.
 */
module.exports = exports = function Menu(mongoose) {

    var Schema = mongoose.Schema,
        utils = require('../../server/utils')(),
        cache = require('../../server/cache')();

    var Menu = new Schema({
        Caption : { type : String, required : true },
        Type    : { type : String, required : true, enum : ['Menu', 'Sidebar'], default : 'Menu' },
        Route   : { type : Schema.Types.ObjectId, ref : 'Route' },
        Position: { type : Number, required : true, default : 0 },
        Parent  : { type : Schema.Types.ObjectId, ref : 'Menu' }
    });

    /**
     * Указываем для новых записей последнюю позицию относительно родителя
     */
    Menu.pre('save', function (next) {
        if (this.isNew) {
            var self = this;
            this.model('Menu')
                .findOne({ Parent : self.Parent, Type : self.Type }, { Position : 1 })
                .sort({ Position : -1 })
                .exec(function (err, doc) {
                    if (err) throw err;
                    if (doc) self.Position = doc.Position + 1;
                    next();
                });
        }
        else next();
    });

    /**
     * Смена позиции записи со смещением соседних
     * @param {Number} [Position=0] - новая позиция
     * @param {(Function|vow.promise)} [next=function() {}] - функция-callback
     */
    Menu.methods.SetPosition = function (Position, next) {
        var self = this,
            old = self.Position;
        Position = Position || 0;
        next = next || function() {};
        if (old === Position) next.resolve? next.resolve(): next();
        else {
            self.Position = Position;
            this.model('Menu').update(
                {
                    Position : old < Position? { $gt : old, $lte : Position}: { $gte : Position, $lt : old},
                    Parent : self.Parent,
                    Type : self.Type
                },
                { $inc : { Position : old < Position? -1: 1 }},
                { multi : true },
                function (err) {
                    if (err) {
                        if (next.reject) next.reject(err);
                        else throw err;
                    }
                    else self.save(function (err) {
                        if (err) {
                            if (next.reject) next.reject(err);
                            else throw err;
                        }
                        else next.resolve? next.resolve(): next();
                    });
                }
            );
        }
    };

    /**
     * Поиск родителя для @curr записи меню
     * @param {Menu} curr - элемент меню
     * @param {Array|Menu} docs - все записи меню
     * @param {Array} res - текущий массив хэшей результатов
     * @returns {children|Array|*}
     * @private
     */
    function getParent(curr, docs, res) {
        var parent = utils.findOne(docs, function (item) { return item._id.equals(curr.Parent); }),
            place = parent? parent.Parent? getParent(parent, docs, res): res: null;
        if (!place) return null;
        !place[parent.Position] && (place[parent.Position] = { caption : parent.Caption });
        parent.Route && (place[parent.Position].path = parent.Route.Path);
        !place[parent.Position].children && (place[parent.Position].children = []);
        return place[parent.Position].children;
    }

    /**
     * Построить массив хэшей меню по типу
     * @param {String} type - тип меню
     * @param {Function|Promise} next - callback
     * @private
     */
    function buildByType(type, next) {
        this
            .find({ Type : type }, { Caption : 1, Route : 1, Position : 1, Parent : 1 })
            .populate('Route')
            .sort({ Position : 1 })
            .exec(function (err, docs) {
                if (err) return next(err);
                if (docs && docs.length) {
                    cache.set(type, docs.reduce(function (prev, curr) {
                        var place = curr.Parent? getParent(curr, docs, prev): prev;
                        if (place) {
                            !place[curr.Position] && (place[curr.Position] = {caption: curr.Caption});
                            curr.Route && (place[curr.Position].path = curr.Route.Path);
                        }
                        return prev;
                    }, []));
                }
                else cache.set(type, []);
                next();
            });
    }

    /**
     * Получить массив хэшей меню по типу
     * @param {String} type - тип меню
     * @param {Function|Promise} next - callback
     * @private
     */
    function getByType(type, next) {
        if (cache.exists(type)) next.resolve? next.resolve(cache.get(type)): next(cache.get(type));
        else buildByType.call(this, type, function (err) {
            if (err) {
                if (next.reject) next.reject(err);
                else throw err;
            }
            else next.resolve? next.resolve(cache.get(type)): next(cache.get(type));
        });
    }

    Menu.statics.GetMenus = function (next) {
        getByType.call(this, 'Menu', next);
    };
    Menu.statics.GetSidebars = function (next) {
        getByType.call(this, 'Sidebar', next);
    };

    return mongoose.model('Menu', Menu);
};