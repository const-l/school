block('editor').mod('page', 'article')(
    content()(function () {
        return applyNext({
            modValue:{
                block : 'input',
                name: 'caption',
                mods: {theme: 'islands', width: 'available', size: 'm'},
                placeholder : 'Заголовок',
                val : this.ctx.caption
            }
        });
    })
);