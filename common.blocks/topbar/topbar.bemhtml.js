block('topbar')(
    js()(true),
    mix()([
        {
            block : 'page',
            mods  : { size : 'desktop' }
        },
        { block : 'clear' }
    ])
);