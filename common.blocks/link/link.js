modules.define('link', ['i-bem__dom'], function (provide, BEMDOM, link) {
        provide(link.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {
                        this.__base.apply(this, arguments);
                        this.bindTo('click',
                            function (e) {
                                this._onClick(e);
                            });
                    }
                }
            },

            _onClick: function () {
                this.emit('click');
            }
        }));
    }
);