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
                /*{ block : 'label', strong : 'Адрес:',
                    content : 'Нижнегорский р-н, с.Пшеничное, ул.50 лет Октября, 10'
                },*/
                { block : 'label', strong : 'Телефон:', content : '+7 (36550) 2-93-27' }
            ]);
        })
    )
);