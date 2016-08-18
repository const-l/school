block('sidebar')(
    wrap()(function () {
        return {
            block : 'column',
            mods : this.ctx.width,
            content : this.ctx
        };
    }),
    match(function() { return this.isFirst(); })(function() { return applyNext({ _firstInner : true }); }),
    match(function() { return !this.inSidebar; })(function() { return applyNext({ inSidebar : true }); }),
    content()(function () {
        var content = this.ctx.content,
            newContent = [];
        Array.isArray(content)? content.map(function (item) {
            newContent.push({ elem : 'item', content : item });
        }): newContent = content;
        return newContent;
    })
);