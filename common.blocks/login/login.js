modules.define('login', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){
    provide(BEMDOM.decl(this.name,
        {
            onSetMod : {
                js : {
                    inited : function () {
                        this._popup = this.findBlockInside('popup')
                            .setAnchor(this);
                        this._loginPopup = this.findBlockInside('login', 'popup')
                            .setAnchor(this.findBlockInside('login', 'input'));
                        this._passwordPopup = this.findBlockInside('password', 'popup')
                            .setAnchor(this.findBlockInside('password', 'input'));
                        this.bindTo('submit', this._onSubmit);
                        this.findBlockInside('login', 'input').bindTo('change', this._onChange.bind(this));
                        this.findBlockInside('password', 'input').bindTo('change', this._onChange.bind(this));
                    }
                }
            },
            _onSubmit : function (e) {
                e.preventDefault();
                var login = this.findBlockInside('login', 'input').getVal(),
                    password = this.findBlockInside('password', 'input').getVal();
                if (!login) return this._loginPopup.setMod('visible');
                if (!password) return this._passwordPopup.setMod('visible');
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
                            this._popup.setMod('visible');
                    },
                    context : this
                });
            },
            _onChange : function () {
                this._popup.hasMod('visible') && this._popup.delMod('visible');
            }
        }
    ));
});