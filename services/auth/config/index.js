var path     = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env      = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'auth_cm'
        },
        security: {
            UTLife: 3600,   // Пользовательский токен живет 1 час
            STLife: 7200,   // Токен доступа сервисный живет 2 часа
            RTLife: 86400   // Токен обновления живет 24 часа
        },
        port: process.env.PORT || 3005,
        db: 'mongodb://localhost/auth_cm'
    }
};

module.exports = config[env];