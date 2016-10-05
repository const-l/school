block('dialog').mod('type', 'confirmation')(
    elem('buttons')(
        content()(function () {
            return [
                {
                    block : "button",
                    mods : { theme: 'islands', size: 'm', type : 'submit' },
                    val : 'YES',
                    text : "Да"
                },
                {
                    block : "button",
                    mods : { theme: 'islands', size: 'm', type : 'submit' },
                    val : 'NO',
                    text : "Нет"
                }
            ]
        })
    )
);