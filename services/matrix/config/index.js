var path     = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env      = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
          name: 'service_cm'
        },
        security: {
            USLife: 1800 // время жизни сервисного токена (30 минут)
        },
        port: process.env.PORT || 3001,
        db: 'mongodb://localhost/service_cm'
    }
};

module.exports = config[env];