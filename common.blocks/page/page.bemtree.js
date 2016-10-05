block('page')(
    def().match(function() { return !this._pageInited; })(function () {
        return local({ _pageInited : true })(function () {
            return applyCtx({
                block: this.block,
                title: this.data.title || 'Пшеничненская СОШ',
                styles: [
                    { elem: 'css', url: this.data.settings.baseUrl + 'index.min.css' }
                ],
                scripts: [
                    { elem : 'js', url : this.data.settings.baseUrl + 'index.min.js' }
                ],
                content: [
                    {
                        block : 'system'
                    },
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