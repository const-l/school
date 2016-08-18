block('root')(
    def()(function () {
        var ctx = this.ctx,
            data = this.data = ctx.data;
        if (ctx.context) return applyCtx(ctx.context);
        return applyCtx({ block: 'page', title: 'School' });
    })
);