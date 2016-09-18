block('editor')(
    wrap()(function () {
        return {
            block : 'editor-group',
            content : [
                this.ctx,
                { block : 'clear' },
                { block : 'file' }
            ]
        }
    }),
    tag()('form'),
    js()(true),
    attrs()(function () { return { action : "save/" + this.ctx.id, method : "post" }; }),
    content()(function () {
        return [
            this.modValue || '',
            {
                block : 'spin-wrapper',
                content : {
                    block : 'spin',
                    mods : { theme : 'islands', size : 'm', visible : true }
                }
            },
            {
                block : 'textarea',
                mods : { theme : 'islands', size : 'm', width : 'available' },
                id : 'content',
                name: "content",
                val: this.ctx.content
            },
            {
                block : 'button',
                mods : { theme : 'islands', size : 'm', hidden: true, type : 'submit' },
                text : 'Сохранить'
            }
        ]
    })
);