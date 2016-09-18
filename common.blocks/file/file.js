modules.define('file', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){
    var popup;
    provide(BEMDOM.decl(this.name,
        {
            onSetMod: {
                js: {
                    inited: function () {
                        popup = this.findBlockInside('popup').setAnchor(this.findElem('loader'));
                        this.bindToDomElem(this.elem('loader'), 'submit', this._onSubmit);
                        this._loadList();
                    }
                }
            },
            _onSubmit : function (e) {
                e.preventDefault();
                var self = this,
                    formData = new FormData(self.elem('loader')[0]);
                $.ajax({
                    url: './upload',
                    type: 'POST',
                    xhr: function() {
                        var myXhr = $.ajaxSettings.xhr();
                        !!myXhr.upload && myXhr.upload.addEventListener('progress', self._uploadProgress.bind(self), false);
                        return myXhr;
                    },
                    success : this._uploadSuccess,
                    error : this._uploadError,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    context : this
                });
            },
            _uploadProgress: function (e) {
                e.lengthComputable && this.findBlockInside('progressbar').setVal(100 * e.loaded / e.total);
            },
            _uploadSuccess: function () {
                this.findBlockInside('progressbar').setVal(0);
                this._loadList();
            },
            _uploadError: function () {
                popup
                    .setContent('Не удалось загрузить файл')
                    .setMod('visible', true);
            },

            _loadList : function () {
                $.ajax({
                    url: './upload',
                    type: 'GET',
                    success: function (html) {
                        BEMDOM.replace(this.findElem('list'), html);
                    },
                    error: function() {
                        popup
                            .setContent('Не удалось загрузить список файлов')
                            .setMod('visible', true);
                    },
                    cache: false,
                    context: this
                });
            }
        },
        {
            /* статические методы */
        }
    ));
});