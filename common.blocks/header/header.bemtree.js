block('header')(
    content()(function () {
        var data = this.data,
            result = [
            {
                block : 'topbar'
            },
            {
                block : 'info'
            },
            {
                block : 'nav'
            }
        ];
        data.url.pathname === '/' && result.push({
            block: 'carousel',
            mods: { orientation: 'horizontal', animate: true },
            content: [
                {
                    elem: 'inner',
                    content: [1, 2, 3, 4, 5].map(function (item, pos) {
                        var res = {
                            elem: 'item',
                            content: {
                                elem: 'img',
                                url: data.settings.baseUrl + 'img/tmp/' + item + '.png'
                            }
                        };
                        pos === 0 && (res.elemMods = { state: 'active' });
                        return res;
                    })
                },
                {
                    elem: 'control',
                    elemMods: { type: 'left', theme: 'default' },
                    content: '‹'
                },
                {
                    elem: 'control',
                    elemMods: { type: 'right', theme: 'default' },
                    content: '›'
                },
                { elem : 'paginator' }
            ]
        });
        return result;
    })
);