modules.define('editor', ['i-bem__dom', 'tinymce__settings', 'tinymce'], function(provide, BEMDOM, settings){
    provide(BEMDOM.decl(this.name,
        {
            /* методы экземпляра */
            onSetMod: {
                js: {
                    inited: function () {
                        this.bindTo('submit', this._onSubmit);
                        settings.setup = function (editor) {
                            editor.on('init', function (e) {
                                this.findBlockInside('button')
                                    .setMod('hidden', false);
                                this.findBlockInside('spin').setMod('visible', false);
                            }.bind(this));
                        }.bind(this);
                        tinymce.init(settings);
                    }
                }
            },
            _onSubmit: function (e) {
                if (!this.validateData()) e.preventDefault();
            },
            validateData: function () {
                return true;
            }
        },
        {
            /* статические методы */
        }
    ));
});

modules.define('editor', function (provide, editor) {
    provide(editor.decl({ modName : 'page', modVal : 'article' },
        {
            /* можно переопределять методы так */
        }
    ));
});