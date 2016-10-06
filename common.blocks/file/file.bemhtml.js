block('file')(
    js()(function () {
        return { id : this.ctx.id };
    }),
    content()(function () {
        return [
            {
                elem : 'list'
            },
            {
                elem : 'loader'
            },
            {
                block : 'progressbar'
            }
        ];
    })
);