modules.define('file', ['i-bem__dom', 'jquery', 'button'], function(provide, BEMDOM, $, button){
    var popup;
    provide(BEMDOM.decl(this.name,
        {
            onSetMod: {
                js: {
                    inited: function () {
                        popup = this.findBlockInside('popup').setAnchor(this.findElem('list'));
                        this.bindToDomElem(this.elem('loader'), 'submit', this._onSubmit);
                        this.findBlockInside('loader', 'attach').on('change', this._onAttachChange, this);
                        button.on(
                            this.elem('list'),
                            'click',
                            this._onClearClick,
                            this
                        );
                        this._loadList();
                    },
                    '': function () {
                        button.un(
                            this.elem('list'),
                            'click',
                            this._onClearClick,
                            this
                        );
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
                this.findBlockInside('loader', 'attach').clear();
                this.findBlockInside('progressbar').setVal(0);
                this._loadList();
            },
            _uploadError: function () {
                popup
                    .setContent('Не удалось загрузить файл')
                    .setMod('visible', true);
            },
            _onAttachChange: function () {
                this.findBlockInside('loader', { block : 'button', modName : 'type', modVal : 'submit' })
                    .setMod('disabled', !this.findBlockInside('loader', 'attach').getVal());
            },
            _onClearClick: function (e) {
                var path = (e.target.params || {}).path;
                $.ajax({
                    url : './upload',
                    type : 'DELETE',
                    data : {
                        path : path
                    },
                    success : this._loadList,
                    error : function() {
                        popup
                            .setContent('Не удалось удалить файл')
                            .setMod('visible', true);
                    },
                    cache : false,
                    context : this
                });
            },

            _loadList : function () {
                $.ajax({
                    url: './upload',
                    type: 'GET',
                    success: function (html) {
                        BEMDOM.update(this.findElem('list'), html);
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