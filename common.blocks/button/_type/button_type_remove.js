modules.define('button', ['jquery', 'events__channels'], function(provide, $, channels, Button) {
    provide(Button.decl({ modName : 'type', modVal : 'remove' },
        {
            onSetMod : {
                'js' : {
                    'inited' : function () {
                        this.on('click', this._onClick);
                    }
                }
            },

            _onClick : function (e) {
                var id = (e.target.params || {}).page_id;
                channels('system')
                    .emit('confirmation', { message : 'Вы действительно хотите удалить выделенную запись?' })
                    .once('result', function (e, data) {
                        (data || {}).val === 'YES' && this._remove(id);
                    }, this);
            },

            _remove : function (id) {
                $.ajax({
                    url : './',
                    type : 'DELETE',
                    data : { id : id },
                    success : function() { location = window.location; },
                    error : function() {
                        channels('system')
                            .emit('error', { message : 'Произошла ошибка, обратитесь к администратору' });
                    },
                    cache : false,
                    context : this
                });
            }
        }
    ));
});