block('dialog')(
    content()(function () {
        return [
            { elem : 'message', message : this.ctx.message },
            { elem : 'buttons' }
        ];
    }),
    elem('message')(
        content()(function () {
            return this.ctx.message;
        })
    )
);