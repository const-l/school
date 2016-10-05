modules.define('system',
    ['i-bem__dom', 'BEMHTML', 'button', 'events__channels'],
    function (provide, BEMDOM, BEMHTML, Button, channels) {
        provide(BEMDOM.decl(this.name,
            {
                onSetMod : {
                    'js' : {
                        'inited' : function () {
                            this._modal = this.findBlockInside({ block : 'modal', modName : 'theme', modVal : 'islands' });
                            channels('system')
                                .on('confirmation', this._onDialogEvent, this)
                                .on('warning', this._onDialogEvent, this)
                                .on('error', this._onErrorEvent, this);
                            Button
                                .on(this._modal.domElem, 'click', this._onButtonClick, this);
                        }
                    }
                },

                _onDialogEvent : function () {
                    this._modal.delMod('autoclosable');
                    this._onEvent.apply(this, arguments);
                },
                _onErrorEvent : function () {
                    this._modal.setMod('autoclosable');
                    this._onEvent.apply(this, arguments);
                },
                _onEvent : function (e, data) {
                    var modal = this._modal,
                        message = (data || {}).message,
                        dialog = modal.findBlockInside({ block : 'dialog', modName : 'type', modVal : e.type });
                    if (dialog && message) {
                        modal.findBlocksInside({ block : 'dialog', modName : 'visible', modVal : true })
                            .forEach(function(item) { item.delMod('visible') });
                        BEMDOM.update(dialog.setMod('visible').elem('message'), message);
                        modal.setMod('visible');
                    }
                },
                _onButtonClick : function (e) {
                    this._modal
                        .delMod('visible');
                    channels('system').emit('result', { val : e.target.getVal() });
                }
            }
        ));
    }
);