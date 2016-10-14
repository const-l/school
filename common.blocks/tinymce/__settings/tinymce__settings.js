modules.define('tinymce__settings', function (provide) {
    provide(
        /** @exports */
        {
            selector: "#content",
            menubar: false,
            statusbar: false,
            plugins: [
                "advlist autolink link image lists anchor searchreplace table contextmenu paste textcolor colorpicker textpattern"
            ],
            toolbar_items_size: 'small',
            toolbar1: "bold italic underline strikethrough | forecolor | alignleft aligncenter alignright alignjustify | fontsizeselect",
            toolbar2: "undo redo | cut copy paste | searchreplace | bullist numlist | outdent indent | link unlink image table ",
            height: 200,
            formats : {
                alignleft : {
                    selector : "img",
                    classes : "image_float_left"
                },
                aligncenter : {
                    selector : "img",
                    classes : "image_float_center"
                },
                alignright : {
                    selector : "img",
                    classes : "image_float_right"
                }
            },
            body_class : "page wrapper_color_gray",
            content_css : "/index.min.css",
            link_class_list : [
                {
                    title : "По-умолчанию",
                    value : "link"
                }
            ],
            target_list : false,
            image_class_list : [
                {
                    title : "По-умолчанию",
                    value : "image_type_article"
                }
            ],
            image_description : false,
            image_title : true
        }
    );
});