({
    shouldDeps: [
        { elems : ['paragraph'] },
        { block : 'image' },
        { block : 'button', mods : { type : 'edit' }}
    ],
    mustDeps: [{
        block : 'caption'
    }]
})