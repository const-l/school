block('article').mod('view', 'list')(
    content()(function () {
        var content = Array.isArray(this.ctx.content)? this.ctx.content: this.ctx.content? [this.ctx.content]: [];
        if (this.ctx.Id && this.data.user && this.data.user.IsAdmin) {
            content.push({
                block : 'control-group',
                mods : { type : 'edit' },
                id : this.ctx.Id
            });
        }
        return content;
    })
);