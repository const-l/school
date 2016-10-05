block('article')(
    content()(function () {
        var content = Array.isArray(this.ctx.content)? this.ctx.content: this.ctx.content? [this.ctx.content]: [];
        if (this.ctx.edit_id && this.data.user && this.data.user.IsAdmin) {
            var group = {
                block : 'control-group',
                mods : { type : 'edit' },
                content : []
            };
            group.content.push({
                block : 'button',
                mods : { type : 'link', view : 'plain' },
                url : '?mode=1&id=' + this.ctx.edit_id,
                icon : {
                    block : 'icon',
                    url : '/img/edit-icon.png'
                }
            });
            !this.ctx.noDelete && group.content.push({
                block : 'button',
                mods : { theme: 'islands', view : 'plain', type : 'remove' },
                js : { page_id : this.ctx.edit_id },
                icon : {
                    block : 'icon',
                    url : '/img/clear.svg'
                }
            });
            content.push(group);
        }
        return content;
    })
);