var path     = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env      = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'auth_cm'
        },
        security : {
            UTLife : 1800,
            STLife : 1800
        },
        port: process.env.PORT || 3005,
        db: 'mongodb://localhost/auth_cm'
    }
};

module.exports = config[env];