block('news-item').elem('preview')(
    mode('line')(function () {
        return { tag : 'br' };
    }),
    content()(function () {
        var content = this.ctx.content.split('\n'),
            result = [];
        for(var i = 0; i < content.length; i++)
            result.push(content[i], apply('line'));
        return result;
    })
);