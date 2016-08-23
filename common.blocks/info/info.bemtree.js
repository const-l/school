block('info')(
    content()(function () {
        return applyCtx([
            { elem : 'logo' },
            { elem : 'quick' }
        ]);
    }),
    elem('logo')(
        content()(function () {
            return applyCtx({
                block : 'link',
                url : '/',
                content : 'МБОУ "Пшеничненская СОШ"'
            });
        })
    ),
    elem('quick')(
        content()(function () {
            return applyCtx([
                { block : 'label', strong : 'Телефон:', content : '+7 (36550) 2-93-27' }
            ]);
        })
    )
);