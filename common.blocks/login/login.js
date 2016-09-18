modules.define('login', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){

    var popup, loginPopup, passwordPopup;

    provide(BEMDOM.decl(this.name,
        {
            onSetMod : {
                js : {
                    inited : function () {
                        popup = this.findBlockInside('popup')
                            .setAnchor(this);
                        loginPopup = this.findBlockInside('login', 'popup')
                            .setAnchor(this.findBlockInside('login', 'input'));
                        passwordPopup = this.findBlockInside('password', 'popup')
                            .setAnchor(this.findBlockInside('password', 'input'));
                        this.bindTo('submit', this._onSubmit);
                        this.findBlockInside('login', 'input').bindTo('change', this._onChange);
                        this.findBlockInside('password', 'input').bindTo('change', this._onChange);
                    }
                }
            },
            _onSubmit : function (e) {
                e.preventDefault();
                var login = this.findBlockInside('login', 'input').getVal(),
                    password = this.findBlockInside('password', 'input').getVal();
                if (!login) return loginPopup.setMod('visible', true);
                if (!password) return passwordPopup.setMod('visible', true);
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
                            popup.setMod('visible', true);
                    },
                    context : this
                });
            },
            _onChange : function () {
                popup.getMod('visible') && popup.setMod('visible', false);
            }
        },
        {
            /* статические методы */
        }
    ));

});