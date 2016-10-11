block('news-item').mod('view', 'list')(
    def()(function () {
        if (this.ctx.Id && this.data.user && this.data.user.IsAdmin) {
            this.ctx.buttons = {
                block : 'control-group',
                mods : { type : 'edit' },
                id : this.ctx.Id
            };
        }
        return this.ctx;
    })
);