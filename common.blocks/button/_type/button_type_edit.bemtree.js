block('button').mod('type', 'edit')(
    def()(function () {
        if (this.ctx.id && this.data.user && this.data.user.IsAdmin)
            return applyCtx({
                    block : 'control-group',
                    mods : { type : 'edit' },
                    content: [
                        {
                            block : 'button',
                            mods : { type : 'link', view : 'plain' },
                            url : '?mode=1&id=' + this.ctx.id,
                            icon : {
                                block : 'icon',
                                url : '/img/edit-icon.png'
                            }
                        }
                    ]
                });
    })
);