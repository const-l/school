block('sidebar')(
    content()(function () {
        var data = this.data,
            sidebar = data.Sidebars || [],
            createItem = function (item) {
                var result = {};
                if (item.children && item.children.length) {
                    result.block = 'list';
                    result.caption = item.caption;
                    result.content = item.children.map(createItem);
                }
                else {
                    result.block = 'link';
                    result.content = item.caption;
                    result.active = data.url.pathname.replace(/\/$/, '') === item.path.replace(/\/$/, '');
                    item.path && (result.url = item.path);
                }
                return result;
            };
        return sidebar.map(createItem);
    })
);