block('topbar')(
    wrap()(function () {
        return { block: 'wrapper', mods : { color : 'green' }, content: this.ctx };
    }),
    content()(function () {
        var data = this.data,
            contentLeft = (data.static || {}).topbar || [],
            contentRight = this.ctx.right || [];
        !Array.isArray(contentRight) && (contentRight = [contentRight]);
        data.user?
            contentRight.push({ elem: 'logout' }):
            contentRight.push(
                { elem : 'login' },
                {
                    block : 'modal',
                    mods: {
                        theme: 'islands',
                        autoclosable : true
                    },
                    content: { block : 'login' }
                });
        return [
            {
                elem : 'left',
                content : contentLeft
            },
            {
                elem : 'right',
                content : contentRight
            }
        ];
    }),
    elem('left')(
        content()(function () {
            var result = [],
                add = function (item) {
                    result.push({
                        block : 'link',
                        url : item.url,
                        content : item.content,
                        title : item.title || '',
                        target : '_blank'
                    });
                };
            Array.isArray(this.ctx.content)? this.ctx.content.map(add): add(this.ctx.content);
            return result;
        })
    ),
    elem('login')(
        content()({ block : 'link', mods: { pseudo: 'true' }, content: 'Войти' })
    ),
    elem('logout')(
        content()(function () {
            return [
                this.data.user.Name + " | ",
                { block : 'link', mods: { pseudo: 'true' }, content: 'Выйти' }
            ]
        })
    )
);