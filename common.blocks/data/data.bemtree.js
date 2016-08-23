block('data')(
    content()(
        function () {
            var result = [],
                data = this.data;
            data && data.main && data.main.forEach(function (item) {
                var article = { block : 'article' };
                item.caption && (article.caption = item.caption);
                item.content && (article.content = item.content);
                result.push(article);
            }, this);
            return result;
        }
    )
);