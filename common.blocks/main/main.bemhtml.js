block('main')(
    tag()('content'),
    mix()([
        { block : 'clear' },
        { block : 'wrapper', mods : { color : 'gray' }}
    ]),
    content()(function () {
        var content = Array.isArray(this.ctx.content)?
            this.ctx.content: [this.ctx.content];
        content.push({ block : 'clear' });
        return applyCtx({
            block : 'wrapper',
            mix : [{ block : 'page', mods : { size : 'desktop' }}],
            content : content
        });
    })
);