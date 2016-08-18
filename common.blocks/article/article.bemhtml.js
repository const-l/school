block('article')(
    match(function() { return !this.inArticle; })(function() { return applyNext({ inArticle : true }); }),
    content()(function () {
        var caption = this.ctx.caption,
            content = [];
        caption && content.push({ block : 'caption', content : caption });
        content.push(this.ctx.content);
        return content;
    }),
    elem('paragraph')(
        tag()('p')
    )
);