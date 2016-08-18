block('label')(
    match(function() { return this.inQuickInfo && !this.isLast(); })(
        mix()([{ mods: { type : 'info' }}])
    ),
    content()(function() {
        var content = [];
        this.ctx.content.search(/\n/ig) >= 0? this.ctx.content.split(/\n/ig).map(function (item) {
            content.push({ block : 'empty', bem : false, content : item })
        }) : content = this.ctx.content;
        return [
            this.ctx.strong? { tag: 'strong', bem: false, content: this.ctx.strong }: '',
            content
        ];
    })
);