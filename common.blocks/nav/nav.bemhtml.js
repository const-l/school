block('nav')(
    mix()([
            { block : 'page', mods : { size : 'desktop' }},
            { block : 'clear' }
    ]),
    match(function() { return !this.inNav; })
        (function() { return applyNext({ inNav : true }); })
);