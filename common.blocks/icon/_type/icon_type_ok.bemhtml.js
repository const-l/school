block('icon').mod('type', 'ok')(
    def()(function () {
        this.ctx.url = '/img/ok_icon.png';
        return applyNext();
    })
);