block('data')(
    content()(
        function () {
            return this.data.main || [];
        }
    )
);