block('image')(
    mix()(
        (function () {
            var mix = { mods : { float : this.ctx.float || 'left' }};
            this.inArticle && (mix.mods.type = 'article');
            return mix;
        })
    )
);