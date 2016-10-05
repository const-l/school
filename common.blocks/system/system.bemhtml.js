block('system')(
    js()(true),
    content()({
        block : 'modal',
        mods : { theme : 'islands' },
        content : [
            { block : 'dialog', mods : { type : 'confirmation' }},
            { block : 'dialog', mods : { type : 'warning' }},
            { block : 'dialog', mods : { type : 'error' }}
        ]
    })
);