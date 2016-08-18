block('main')(
    content()(function () {
        /**
        * Обязательно оборачивание в функцию, иначе не будет работать wrap в sidebar'e и data
        * */
        return [
            { block : 'sidebar', width: { quarter : 'one' }},
            { block : 'data', width: { quarter : 'three' }}
        ];
    })
);