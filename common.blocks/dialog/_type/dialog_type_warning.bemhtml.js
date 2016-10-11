block('dialog').mod('type', 'warning')(
    elem('buttons')(
        content()(function () {
            return [
                {
                    block : "button",
                    mods : { theme: 'islands', size: 'm', type : 'submit' },
                    val : 'OK',
                    text : "OK"
                }
            ]
        })
    )
);