block('main')(
    content()(function () {
        /**
        * Обязательно оборачивание в функцию, иначе не будет работать wrap в sidebar'e и data
        * */
        return this.ctx.main_content || [
            { block : 'sidebar', width: { quarter : 'one' }},
            { block : 'data', width: { quarter : 'three' }}
        ];
    })
);