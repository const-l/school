block('news-item').mod('view', 'list')(
    content()(function () {
        var content = [];
        this.ctx.image && content.push({
            block : 'link',
            url : '?id=' + this.ctx.Id,
            content : {
                block: 'image',
                width: 100,
                height: 100,
                url: this.ctx.image
            }
        });
        content.push(
            {
                elem : 'caption',
                mix : 'caption',
                content : {
                    block : 'link',
                    url : '?id=' + this.ctx.Id,
                    content : this.ctx.caption
                }
            },
            {
                elem : 'preview',
                content : this.ctx.preview
            },
            this.ctx.buttons);
        return content;
    })
);