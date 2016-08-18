block('data')(
    content()(
        /*[{
            block : 'article',
            caption : 'Headline Colour And Size Are All The Same',
            content : [
                {
                    block : 'image',
                    float : 'right',
                    url : '/img/imgr.gif'
                },
                {
                    elem : 'paragraph',
                    content : 'Aliquatjusto quisque nam consequat doloreet vest orna partur scetur portortis nam. Metadipiscing eget facilis elit sagittis felisi eger id justo maurisus convallicitur.'
                },
                {
                    elem : 'paragraph',
                    content : [
                        'Dapiensociis ',
                        {
                            block : 'link',
                            url : '#',
                            content : 'temper donec auctortortis cumsan'
                        },
                        ' et curabitur condis lorem loborttis leo. Ipsumcommodo libero nunc at in velis tincidunt pellentum tincidunt vel lorem.'
                    ]
                },
                {
                    block : 'image',
                    url : '/img/imgl.gif'
                },
                {
                    elem : 'paragraph',
                    content : [
                        'This is a W3C compliant free website template from ',
                        {
                            block : 'link',
                            url : '#',
                            content : 'OS Templates'
                        },
                        '. For full terms of use of this template please read our ',
                        {
                            block : 'link',
                            url : '#',
                            content : 'website template licence'
                        },
                        '.'
                    ]
                },
                {
                    elem : 'paragraph',
                    content : [
                        'You can use and modify the template for both personal and commercial use. You must keep all copyright information and credit links in the template and associated files. For more website templates visit our ',
                        {
                            block : 'link',
                            url : '#',
                            content : 'free website templates'
                        },
                        ' section.'
                    ]
                },
                {
                    elem : 'paragraph',
                    content : 'Portortornec condimenterdum eget consectetuer condis consequam pretium pellus sed mauris enim. Puruselit mauris nulla hendimentesque elit semper nam a sapien urna sempus.'
                }
            ]
        }]*/
        function () {
            var result = [],
                data = this.data;
            data && data.main && data.main.forEach(function (item) {
                var article = { block : 'article' };
                item.caption && (article.caption = item.caption);
                item.data && (article.content = item.data);
                result.push(article);
            }, this);
            return result;
        }
    )
);