({
    shouldDeps: [
        { block : 'spin', mods: {'theme' : 'islands', 'size': 'm', 'visible': true}},
        { block : 'button', mods: {'theme' : 'islands', 'size': 'm', 'type': 'submit'}},
        { block : 'textarea', mods: {'theme' : 'islands', 'size': 'm', 'width' : 'available'}},
        { block : 'input', mods: { hide : true }},
        { mods : { page: ['article', 'news-item']}}
    ],
    mustDeps: [
        { block : 'tinymce' },
        'editor-group'
    ]
})