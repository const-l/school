block('file').elem('loader')(
    tag()('form'),
    attrs()({
        enctype : 'multipart/form-data'
    }),
    content()([
        {
            block : 'attach',
            mods : { theme : 'islands', size : 'm' },
            button : 'Выберите файл',
            noFileText : 'Файл не выбран',
            name: 'file'
        },
        {
            block : 'button',
            mods : { type : 'submit', theme : 'islands', size : 'm' },
            text : 'Загрузить'
        }
    ])
);