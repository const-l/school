modules.define(
    'tinymce',
    ['loader_type_js', 'tinymce__config'],
    function (provide, loader, config) {
        loader(
            config.url,
            function () {
                provide(tinymce);
            }
        );
    }
);