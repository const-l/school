modules.define('nav', ['i-bem__dom', 'link', 'jquery'], function (provide, BEMDOM, Link, $) {
    var navInited = false;
    provide(BEMDOM.decl(this.name, {
        onSetMod : {
            js : {
                'inited' : function () {
                    !navInited && $.ajax({
                        type: 'GET',
                        dataType: 'html',
                        cache: false,
                        url: '/navigation',
                        data: {
                            renderTo: 'main'
                        },
                        success: function (result) {
                            navInited = true;
                            BEMDOM.replace(this.domElem, result);
                        }.bind(this)
                    });
                    /*Link.on(
                        this.domElem,
                        'click',
                        this._onLinkClick,
                        this
                    );*/
                },
                '' : function () {
                    /*Link.un(
                        this.domElem,
                        'click',
                        this._onLinkClick,
                        this
                    );*/
                }
            }
        },

        _onLinkClick: function (e) {
            if (!e.target.hasMod('active')) {
                this.findBlocksInside({
                    block: 'link',
                    modName: 'active',
                    modVal: true
                })
                    .map(function (item) {
                        item.delMod('active');
                    });
                e.target.setMod('active');
            }
        }
    }));
});