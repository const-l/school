block('editor').mod('page', 'article')(
    content()(function () {
        return applyNext({
            modValue:{
                block : 'input',
                name: 'caption',
                mods: {theme: 'islands', width: 'available', size: 'm'},
                val : this.ctx.caption
            }
        });
    })
);