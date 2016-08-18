block('page')(
    def().match(function() { return !this._pageInited; })(function () {
        return local({ _pageInited : true })(function () {
            return applyCtx({
                block: this.block,
                title: this.ctx.title,
                styles: [
                    { elem: 'css', url: this.data.settings.baseUrl + 'index.min.css' }
                ],
                scripts: [
                    { elem: 'js', url: this.data.settings.baseUrl + 'index.min.js' }
                ],
                content: [
                    {
                        block: 'header'
                    },
                    {
                        block: 'main'
                    },
                    {
                        block: 'footer'
                    }
                ]
            });
        });
    })
);