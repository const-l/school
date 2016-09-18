block('file').elem('list')(
    mode('item')(function () {
        return {
            elem : 'list-item',
            content : this['file-item']
        }
    }),
    content()(function () {
        var items = [],
            files = this.data.files;

        for (var i = 0; i < files.length; i++) {
            items.push(apply('item', { 'file-item' : files[i] }));
        }

        return items;
    })
);