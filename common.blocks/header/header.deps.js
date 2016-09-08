({
    shouldDeps : [
        { block: 'wrapper', mods: { color: ['green', 'gray', 'double-gray'] }},
        { block : 'topbar' },
        { block : 'info' },
        { block : 'nav' },
        {
            block : 'carousel',
            mods: {orientation:'horizontal'},
            elems: [
                {elem : 'control', mods: { theme : 'default' }},
                'img',
                'paginator',
                'caption'
            ]
        }
    ]
})