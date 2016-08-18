/**
 * Created by Constantine on 20.07.2016.
 */
var mongoose = require('mongoose'),
    schemas = {
        User  : require('./User')(mongoose),
        Page  : require('./Page')(mongoose),
        Route : require('./Route')(mongoose),
        Menu  : require('./Menu')(mongoose)
    },
    config = require('./../../server/config');

mongoose.connect(config.mongoose.uri);

module.exports = schemas;