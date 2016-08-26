block('root')(
    def()(function () {
        /* Пробрасываем данные во все блоки */
        this.data = this.ctx.data;
        /* Если есть контекст, то отрисовываем в нем */
        if (this.ctx.context) return applyCtx(this.ctx.context);
        /* иначе идем по "общему" пути */
        return applyCtx({ block: 'page' });
    })
);