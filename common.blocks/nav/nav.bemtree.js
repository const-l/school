block('nav')(
    content()(function () {
        var data = this.data,
            menu = data.Menus || [],
            createItem = function (item) {
                var result = {
                    block : 'link',
                    content : item.caption,
                    active : data.url.pathname.replace(/\/$/, '') === item.path.replace(/\/$/, '')
                };
                item.path && (result.url = item.path);

                item.children && item.children.length && (result.sublist = item.children.map(createItem));
                result.sublist && result.sublist.filter(function(item) { return item.active; }).length && (result.active = true);
                return result;
            };
        return menu && menu.length?
            { block : 'list', content : menu.map(createItem) } : {};
    })
);