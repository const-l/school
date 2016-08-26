modules.define('login', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){

    provide(BEMDOM.decl(this.name,
        {
            onSetMod : {
                js : {
                    inited : function () {
                        var popup = this.findBlockInside('popup').setAnchor(this),
                            button = this.findBlockInside('submit', 'button'),
                            login = this.findBlockInside('login', 'input'),
                            loginPopup = this.findBlockInside('login', 'popup').setAnchor(login),
                            password = this.findBlockInside('password', 'input'),
                            passwordPopup = this.findBlockInside('password', 'popup').setAnchor(password);

                        button.on('click', function () {
                            if (!login._val) loginPopup.toggleMod('visible', true);
                            else if (!password._val) passwordPopup.toggleMod('visible', true);
                            else $.ajax({
                                    type: 'POST',
                                    cache: false,
                                    dataType: 'json',
                                    url: '/login',
                                    data: {
                                        login:login._val,
                                        password:password._val
                                    },
                                    success: function (result) {
                                        result.success? (location = window.location) :popup.setMod('visible', true);
                                    }.bind(this)
                                });
                        });
                    }
                }
            }
        },
        {
            /* статические методы */
        }
    ));

});