block('footer')(
    content()(function() { return (this.data.static || {}).footer || {}; })
);