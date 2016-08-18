block('link')(
    match(function() { return this.inNav; })(
        mix()(function () {
            var result = [{ mods : { type : 'nav' }}];
            this.ctx.active && result.push({ mods: { active : true }});
            return result;
        })
    ),
    match(function() { return this.inLogoInfo })(
        mix()({ mods: { type : 'logo' }})
    ),
    match(function() { return this.inSidebar })(
        mix()(function () {
            var result = [{ mods : { type : 'sidebar' }}];
            this.ctx.active && result.push({ mods: { active : true }});
            return result;
        })
    )
);