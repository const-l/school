block('data')(
    wrap()(function () {
        return {
            block : 'column',
            mods : this.ctx.width,
            content : this.ctx
        };
    }),
    match(function() { return this.isFirst(); })(function() { return applyNext({ _firstInner : true }); })
);