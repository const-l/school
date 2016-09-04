modules.define('editor', ['i-bem__dom', 'jquery', 'tinymce'], function(provide, BEMDOM, $){
    provide(BEMDOM.decl(this.name,
        {
            /* методы экземпляра */
            onSetMod: {
                js: {
                    inited: function () {
                        this.bindTo('submit', this._onSubmit);
                        tinymce.init({
                            selector: "#content",
                            menubar: false,
                            statusbar: false,
                            plugins: [
                                "advlist autolink link image lists anchor searchreplace table contextmenu paste textcolor colorpicker textpattern"
                            ],
                            toolbar_items_size: 'small',
                            toolbar1: "bold italic underline strikethrough | forecolor | alignleft aligncenter alignright alignjustify | fontsizeselect",
                            toolbar2: "undo redo | cut copy paste | searchreplace | bullist numlist | outdent indent | link unlink image table ",
                            /*language: 'ru_RU',*/
                            height: 200,
                            setup: function (editor) {
                                editor.on('init', function (e) {
                                    this.findBlockInside('button')
                                        .setMod('hidden', false);
                                    this.findBlockInside('spin').setMod('visible', false);
                                }.bind(this));
                            }.bind(this)
                        });
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