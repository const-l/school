block('file')(
    js()(true),
    content()(function () {
        return [
            {
                elem : 'list'
            },
            {
                block: "popup",
                mods : { theme : 'islands', target : 'anchor', type: 'warning', autoclosable: true },
                directions : ['top-center']
            },
            {
                elem : 'loader'
            },
            {
                block : 'progressbar'
            }
        ];
    })
);