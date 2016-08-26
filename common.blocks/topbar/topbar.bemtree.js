block('topbar')(
    wrap()(function () {
        return { block: 'wrapper', mods : { color : 'green' }, content: this.ctx };
    }),
    content()(function () {
        var contentLeft = this.ctx.left || [],
            contentRight = this.ctx.right || [];
        !Array.isArray(contentRight) && (contentRight = [contentRight]);
        this.data.user?
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
        return applyCtx([
            {
                elem : 'left',
                content : contentLeft
            },
            {
                elem : 'right',
                content : contentRight
            }
        ]);
    }),
    elem('left')(
        content()(function () {
            var result = [];
            this.ctx.content.map(function (item) {
                result.push({ block : 'link', url : item.url, content : item.content, target : '_blank' });
            });
            return applyCtx(result);
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