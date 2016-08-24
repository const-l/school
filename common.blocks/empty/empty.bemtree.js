block('empty')(
    content()([
        {
            block : 'image',
            mods : { float : 'right' },
            url : '/img/not_found.png'
        },
        {
            block : 'caption',
            content : 'Страница не найдена'
        },
        {
            block : 'text',
            content : 'Страница, которую вы запросили, не находится в нашей базе данных. Скорее всего вы попали на битую ссылку или опечатались при вводе URL'
        }
    ])
);