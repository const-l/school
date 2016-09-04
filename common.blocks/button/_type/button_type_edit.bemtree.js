block('button').mod('type', 'edit')(
    def()(function () {
        var ctx = this.ctx.id && this.data.user && this.data.user.IsAdmin?
            {
                block : 'control-group',
                mods : { type : 'edit' },
                content: [
                    {
                        block : 'button',
                        mods : { type : 'link', view : 'plain' },
                        url : '?edit_mode=true&id=' + this.ctx.id,
                        icon : {
                            block : 'icon',
                            url : '/img/edit-icon.png'
                        }
                    }
                ]
            } : {};
        return applyCtx(ctx);
    })
);