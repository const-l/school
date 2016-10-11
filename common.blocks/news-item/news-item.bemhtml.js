block('news-item')(
    content()(function () {
        var content = this.ctx.caption? [{ block : 'caption', content : this.ctx.caption }]: [];
        content.push(this.ctx.content);
        return content;
    })
);