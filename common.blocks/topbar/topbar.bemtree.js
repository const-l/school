block('topbar')(
    def().match(function () { return !this._wrapped; })(function() {
        return local({ _wrapped : true })(function() {
            return applyCtx({ block: 'wrapper', mods : { color : 'green' }, content: this.ctx });
        });
    }),
    content()(function () {
        var contentLeft = this.ctx.left || [{ url : 'https://ya.ru', content : 'Yandex' }, { url : 'google.com', content : 'Google' }],
            contentRight = this.ctx.right || [];
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
    )
);