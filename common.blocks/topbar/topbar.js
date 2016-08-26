modules.define('topbar', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){

    provide(BEMDOM.decl(this.name,
        {
            onSetMod : {
                js : {
                    inited : function () {
                        var modal = this.findBlockInside('modal'),
                            elem = this.findElem('login'),
                            logout = this.findBlockInside('logout', 'link');

                        modal && elem && BEMDOM.blocks.link.on(elem, 'click', function() {
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