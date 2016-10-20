block('link').mod('type', 'footer')(
    content()(function () {
        var result = [],
            icon = this.ctx.icon,
            content = this.ctx.content;
        icon && result.push({ block : 'icon', url : icon });
        result.length? result.push(content): (result = content);
        return result;
    })
);