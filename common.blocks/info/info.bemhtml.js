block('info')(
    mix()([
        { block : 'page', mods : { size : 'desktop' }},
        { block : 'clear' }
    ]),
    elem('quick')(
        match(function() { return !this.inQuickInfo; })
            (function() { return applyNext({ inQuickInfo: true })})
    ),
    elem('logo')(
        match(function() { return !this.inLogoInfo; })
            (function() { return applyNext({ inLogoInfo: true })})
    )
);