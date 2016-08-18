block('nav')(
    content()(function () {
        var data = this.data,
            menu = data.Menus || [];
        return menu.map(function (item) {
            var result = { block : 'link', content: item.caption, active: data.url.path.replace(/\/$/, '') === item.path.replace(/\/$/, '') };
            item.path && (result.url = item.path);
            return result;
        })
    })
);