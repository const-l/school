modules.define('login', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){

    provide(BEMDOM.decl(this.name,
        {
            onSetMod : {
                js : {
                    inited : function () {
                        this.findBlockInside('popup')
                            .setAnchor(this);
                        this.findBlockInside('login', 'popup')
                            .setAnchor(this.findBlockInside('login', 'input'));
                        this.findBlockInside('password', 'popup')
                            .setAnchor(this.findBlockInside('password', 'input'));
                        this.bindTo('submit', this._onSubmit)
                    }
                }
            },
            _onSubmit : function (e) {
                e.preventDefault();
                var login = this.findBlockInside('login', 'input').getVal(),
                    password = this.findBlockInside('password', 'input').getVal();
                if (!login) return this.findBlockInside('login', 'popup').toggleMod('visible', true);
                if (!password) return this.findBlockInside('password', 'popup').toggleMod('visible', true);
                $.ajax({
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    url: '/login',
                    data: {
                        login : login,
                        password : password
                    },
                    success: function (result) {
                        result.success?
                            (location = window.location):
                            this.findBlockInside('popup').setMod('visible', true);
                    },
                    context : this
                });
            }
        },
        {
            /* статические методы */
        }
    ));

});