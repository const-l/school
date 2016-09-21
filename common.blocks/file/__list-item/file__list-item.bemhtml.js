block('file').elem('list-item')(
    content()(function () {
        return [
            this.ctx.content,
            {
                block : 'button',
                mods : { theme: 'islands', view : 'plain' },
                js : { path : this.ctx.content },
                icon : {
                    block : 'icon',
                    url : '/img/clear.svg'
                }
            }
        ];
    })
);