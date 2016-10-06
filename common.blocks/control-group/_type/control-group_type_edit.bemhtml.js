block('control-group').mod('type', 'edit')(
    content()(function () {
        var result = [{
            block : 'button',
            mods : { type : 'link', view : 'plain' },
            url : '?mode=1&id=' + this.ctx.id,
            icon : {
                block : 'icon',
                url : '/img/edit-icon.png'
            }
        }];
        !this.ctx.noDelete && result.push({
            block : 'button',
            mods : { theme: 'islands', view : 'plain', type : 'remove' },
            js : { page_id : this.ctx.id },
            icon : {
                block : 'icon',
                url : '/img/clear.svg'
            }
        });
        return result;
    })
);