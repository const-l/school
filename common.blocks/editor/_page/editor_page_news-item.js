modules.define('editor', ['events__channels'], function (provide, channels, Editor) {
    provide(Editor.decl({ modName : 'page', modVal : 'news-item' },
        {
            validateData : function () {
                var captionBlock = this.findBlockInside('caption', { block : 'input', name : 'caption' });
                if (!captionBlock.getVal()) {
                    channels('system')
                        .emit('warning', { message : 'Заголовок не должен быть пуст' })
                        .once('result', function() {
                            captionBlock._focus();
                        }, this);
                    return false;
                }
                return true;
            }
        }
    ));
});