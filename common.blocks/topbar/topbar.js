modules.define('topbar', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){

    provide(BEMDOM.decl(this.name,
        {
            onSetMod : {
                js : {
                    inited : function () {
                        var modal = this.findBlockInside('modal'),
                            login = this.findBlockInside('login', 'link'),
                            logout = this.findBlockInside('logout', 'link');

                        modal && login && login.bindTo('click', function() {
                            modal.setMod('visible', true);
                        });

                        logout && logout.bindTo('click', function () {
                            $.ajax({
                                type: 'POST',
                                cache: false,
                                dataType: 'json',
                                url: '/logout',
                                success: function () {
                                    location = window.location;
                                }
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