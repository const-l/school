block('button').mod('type', 'add')(
    def()(function () {
        if (this.data.user && this.data.user.IsAdmin)
            return applyCtx([{
                block : 'button',
                mods : { type : 'link', theme : 'islands', size : 'm' },
                url : '?mode=1',
                text : 'Добавить'
            }, { block : 'clear', mods : { size : 's' }}]);
    })
);