block('footer')(
    wrap()(function () {
        return {
            block : 'wrapper',
            tag : 'footer',
            mods : { color : 'double-gray' },
            content : this.ctx
        };
    }),
    mix()([{ block : 'page', mods : { size : 'desktop' }}, { block : 'clear' }])
);