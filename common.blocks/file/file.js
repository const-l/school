modules.define('file', ['i-bem__dom', 'jquery', 'events__channels', 'button'],
    function(provide, BEMDOM, $, channels, button){
        provide(BEMDOM.decl(this.name,
            {
                onSetMod: {
                    js: {
                        inited: function () {
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
                        url: './upload/?id=' + (this.params.id || ''),
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
                    channels('system')
                        .emit('error', { message : 'Не удалось загрузить файл' });
                },
                _onAttachChange: function () {
                    this.findBlockInside('loader', { block : 'button', modName : 'type', modVal : 'submit' })
                        .setMod('disabled', !this.findBlockInside('loader', 'attach').getVal());
                },
                _onClearClick: function (e) {
                    var path = (e.target.params || {}).path;
                    channels('system')
                        .emit('confirmation', { message : 'Вы действительно хотите удалить выделенную запись?' })
                        .once('result', function (e, data) {
                            (data || {}).val === 'YES' && this._remove(path);
                        }, this);
                },
                _remove: function (path) {
                    $.ajax({
                        url : './upload/?id=' + (this.params.id || ''),
                        type : 'DELETE',
                        data : {
                            path : path
                        },
                        success : this._loadList,
                        error : function() {
                            channels('system')
                                .emit('error', { message : 'Не удалось удалить файл' });
                        },
                        cache : false,
                        context : this
                    });
                },

                _loadList : function () {
                    $.ajax({
                        url: './upload/?id=' + (this.params.id || ''),
                        type: 'GET',
                        success: function (html) {
                            BEMDOM.update(this.findElem('list'), html);
                        },
                        error: function() {
                            channels('system')
                                .emit('error', { message : 'Не удалось загрузить список файлов' });
                        },
                        cache: false,
                        context: this
                    });
                }
            }
        ));
    }
);