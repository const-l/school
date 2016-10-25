block('info')(
    content()(function () {
        return applyCtx([
            { elem : 'logo' },
            { elem : 'quick' }
        ]);
    }),
    elem('logo')(
        content()(function () {
            var _static = this.data.static || {};
            return applyCtx({
                block : 'link',
                url : '/',
                content : (_static.info || {}).logo || 'Название'
            });
        })
    ),
    elem('quick')(
        content()(function () {
            var _static = this.data.static || {};
            return (_static.info || {}).quick || '';
        })
    )
);