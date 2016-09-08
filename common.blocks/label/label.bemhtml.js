block('label')(
    match(function() { return this.inQuickInfo && !this.isLast(); })(
        mix()([{ mods: { type : 'info' }}])
    ),
    content()(function() {
        return [
            this.ctx.strong? { tag: 'strong', bem: false, content: this.ctx.strong }: '',
            this.ctx.content.search(/\n/ig) >= 0?
                this.ctx.content.split(/\n/ig).map(function (item) {
                    return { bem : false, content : item };
                }):
                this.ctx.content
        ];
    })
);