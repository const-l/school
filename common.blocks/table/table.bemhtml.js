block('table')(
    wrap()(function () {
        return {
            block : 'scrollable',
            content : this.ctx
        };
    }),
    bem()(false),
    tag()('table'),
    content()(function () {
        var content = [];
        this.ctx.caption && content.push({ block : 'caption', content : this.ctx.caption });
        this.ctx.head && content.push({ elem : 'head', content : this.ctx.head });
        content.push({ elem : 'body', content : this.ctx.content });
        return content;
    }),
    elem('head')(
        bem()(false),
        tag()('thead'),
        content()(function () {
            var content = [];
            if (this.ctx.content && !Array.isArray(this.ctx.content))
                throw Error('table: head must be array');
            this.ctx.content.map(function (row) {
                content.push({ elem : 'row', isHead : true, content : row });
            });
            return content;
        })
    ),
    elem('body')(
        bem()(false),
        tag()('tbody'),
        content()(function () {
            var content = [];
            if (this.ctx.content && !Array.isArray(this.ctx.content))
                throw Error('table: content must be array');
            this.ctx.content.map(function (row) {
                content.push({ elem : 'row', content : row });
            });
            return content;
        })
    ),
    elem('row')(
        bem()(false),
        tag()('tr'),
        content()(function () {
            var ctx = this.ctx,
                content = [];
            if (this.ctx.content) {
                Array.isArray(this.ctx.content)?
                    this.ctx.content.map(function (cell) {
                        content.push({ elem : (ctx.isHead? 'headCell': 'cell'), content : cell });
                    }):
                    content.push({ elem : (ctx.isHead? 'headCell': 'cell'), content : this.ctx.content });
            }
            return content;
        })
    ),
    elem('cell')(
        bem()(false),
        tag()('td')
    ),
    elem('headCell')(
        bem()(false),
        tag()('th')
    )
);