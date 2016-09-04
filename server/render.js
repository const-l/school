var path = require('path'),
    config = require('./config'),

    env = process.env.NODE_ENV,
    isDev = env === 'development',
    useCache = !isDev,

    cache = require('./cache')(),
    bundles = {};

config.bem.bundles.forEach(function (bundle) {
    var pathToBundle = path.resolve('./desktop.bundles', bundle),
        BEMTREE = require(path.join(pathToBundle, bundle + '.bemtree.js')).BEMTREE,
        BEMHTML = require(path.join(pathToBundle, bundle + '.bemhtml.js')).BEMHTML;

    bundles[bundle] = { BEMTREE: BEMTREE, BEMHTML: BEMHTML };
});

function render(req, res, data, context) {
    var query = req.query,
        user = req.session.user,
        cacheKey = req.url + (context? JSON.stringify(context): '') + (user? JSON.stringify(user): ''),
        cached = cache.get(cacheKey);
    data = data || {};
    data.bundle = data.bundle || 'index';

    if (isDev && query.json)
        return res.send(JSON.stringify(data, null, 4));

    if (useCache && cached && (new Date() - cached.timestamp < config.cacheAge))
        return res.send(cached.html);

    var bemtreeCtx = {
        block: 'root',
        context: context,
        data: Object.assign({}, {
            url: req._parsedUrl,
            user: user,
            settings: config.settings
        }, data)
    };

    try {
        var bemjson = bundles[data.bundle].BEMTREE.apply(bemtreeCtx);
    }
    catch (err) {
        console.error('BEMTREE error', err.stack);
        console.trace('server stack');
        return res.sendStatus(500);
    }

    if (isDev && query.bemjson)
        return res.send(JSON.stringify(bemjson, null, 4));

    try {
        var html = bundles[data.bundle].BEMHTML.apply(bemjson);
    } catch (err) {
        console.error('BEMHTML error', err.stack);
        console.trace('server stack');
        return res.sendStatus(500);
    }

    useCache && cache.set(cacheKey, {
        timestamp: new Date(),
        html: html
    }, { overwrite : true });

    res.send(html);
}

module.exports = render;