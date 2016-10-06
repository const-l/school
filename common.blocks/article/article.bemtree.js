block('article')(
    content()(function () {
        var content = Array.isArray(this.ctx.content)? this.ctx.content: this.ctx.content? [this.ctx.content]: [];
        if (this.ctx.edit_id && this.data.user && this.data.user.IsAdmin) {
            content.push({
                block : 'control-group',
                mods : { type : 'edit' },
                id : this.ctx.edit_id
            });
        }
        return content;
    })
);