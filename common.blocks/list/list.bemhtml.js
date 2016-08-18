block('list')(
    def().match(function() { return !this.ctx._level; })(function () {
        this.ctx._level = 1;
        return applyCtx(this.ctx);
    }),
    tag()('ul'),
    content()(function () {
        var ctx = this.ctx,
            level = ctx._level,
            content = [];
        if (ctx.content && !Array.isArray(ctx.content)) throw Error('list: content must be array');
        !!ctx.caption && (content.push({ block : 'caption', content : ctx.caption }));
        ctx.content.map(function (item) { content.push({ elem : 'item', _level : level, content : item }); });
        return content;
    }),
    elem('item')(
        mix()(function() { return [{ elemMods : { level : this.ctx._level }}]; }),
        tag()('li'),
        content()(function () {
            var content = [this.ctx.content],
                sublist = this.ctx.content.sublist;
            sublist && Array.isArray(sublist) && sublist.length > 0 && content.push({
                block : 'list', _level : (this.ctx._level + 1), content : sublist
            });
            return content;
        })
    )
);