block('article')(
    content()(function () {
        var content = Array.isArray(this.ctx.content)? this.ctx.content: this.ctx.content? [this.ctx.content]: [];
        content.push({
            block : 'button',
            mods : { type : 'edit' },
            id : this.ctx.edit_id
        });
        return content;
    })
);