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
        data.carousel && !!data.carousel.length && result.push({
            block: 'carousel',
            mods: { orientation: 'horizontal', animate: true },
            content: [
                {
                    elem: 'inner',
                    content: data.carousel.map(function (item, pos) {
                        var res = {
                            elem: 'item',
                            content: {
                                elem: 'img',
                                url: data.settings.baseUrl + item
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