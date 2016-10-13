var path = require('path');

var config = {
    express: {
        port: process.env.PORT || 3000
    },
    /**
    * file session.js look like this
    * module.exports = { secret: 'some_secret_phrase' };
    */
    session: require('./session'),
    mongoose : {
        uri : process.env.MONGO_BASE || 'mongodb://localhost/school_dev',
		dataFilePath : './db/data.json',
        pageLimit : process.env.MONGO_PAGE_LIMIT || 10
    },
    cacheAge: 30 * 60 * 1000,
    public: './public',
    settings: {},
    bem: {
        bundles: ['index']
    }
};

config.settings.baseUrl = 'http://' + (process.env.URL || 'localhost') + ':' + config.express.port + '/';
config.settings.carousel = process.env.CAROUSEL_PATH || path.join(config.public, 'img', 'carousel');

module.exports = config;