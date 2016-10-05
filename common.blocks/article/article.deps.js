({
    shouldDeps: [
        { elems : ['paragraph'] },
        { block : 'image' },
        { block : 'control-group', mods : { type : 'edit' }},
        { block : 'button', mods : { size : 'm', theme : 'islands', type : ['link', 'remove'], view : 'plain' }},
        { block : 'icon' }
    ],
    mustDeps: [{
        block : 'caption'
    }]
})