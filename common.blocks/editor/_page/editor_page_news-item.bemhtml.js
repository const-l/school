block('editor').mod('page', 'news-item')(
    content()(function () {
        return applyNext({
            modValue : [
                {
                    elem : 'caption',
                    content : {
                        block : 'input',
                        name : 'caption',
                        mods : { theme: 'islands', width : 'available', size : 'm' },
                        placeholder : 'Заголовок',
                        val : this.ctx.caption
                    }
                },
                {
                    block : 'input',
                    name : 'image',
                    mods : { theme: 'islands', width : 'available', size : 'm' },
                    placeholder : 'Адрес фото для списка',
                    val : this.ctx.image
                },
                {
                    block : 'textarea',
                    name : 'preview',
                    mods : { theme: 'islands', width : 'available', size : 'm' },
                    placeholder : 'Краткое описание для списка',
                    val : this.ctx.preview
                }
            ]
        });
    })
);