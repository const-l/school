/**
 * Cache storage
 * Created by Constantine on 25.07.2016.
 */
var STORAGE = {
    MENUS : {}
};

var utils = require('./utils')();

module.exports = function (schemas) {

    var Menu = schemas.Menu;

    var fillStorage = function (defer) {
            utils
                .chain([
                    fillTopMenu,
                    fillSidebarMenu
                ])
                .then(
                    function() { defer.resolve(); },
                    function(err) { defer.reject(err); }
                );
        },
        fillTopMenu = function (defer) {
            fillMenu('Menu', defer);
        },
        fillSidebarMenu = function (defer) {
            fillMenu('Sidebar', defer);
        },
        fillMenu = function (Type, defer) {
            Menu.find({ Parent : null, Type : Type }, { Caption : 1, Route : 1, Position : 1 })
                .populate('Route')
                .sort({ Position : 1 })
                .exec(function (err, docs) {
                    if (err) return defer.reject(err);
                    if (docs) {
                        utils.forEachChain(docs, function (defer, item) {
                            var menuItem = {
                                caption : item.Caption,
                                route : item.Route,
                                children : []
                            };
                            Menu.find({ Parent : item._id, Type : Type }, { Caption : 1, Route : 1, Position : 1 })
                                .populate('Route')
                                .sort({ Position : 1 })
                                .exec(function (err, docs) {
                                    if (err) return defer.reject(err);
                                    if (docs) {
                                        docs.forEach(function (item) {
                                            menuItem.children.push({ caption : item.Caption, route : item.Route });
                                        });
                                    }
                                    !STORAGE.MENUS[Type] && (STORAGE.MENUS[Type] = []);
                                    STORAGE.MENUS[Type].push(menuItem);
                                    defer.resolve();
                                });
                        }).then(
                            function () { defer.resolve(); },
                            function (err) { defer.reject(err); }
                        );
                    }
                    else defer.resolve();
                });
        };

    return {
        fill : fillStorage,
        get : function (key) {
            if (!key) return null;
            else return STORAGE[key];
        },
        getMenu : function (type) {
            var menus = this.get('MENUS');
            return type? menus[type]: menus;
        }
    }
};