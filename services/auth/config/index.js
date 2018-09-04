var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'auth_cm'
    },
    security : {
      userTokenLife : 1800,
      serviceTokenLife : 100
    },
    port: process.env.PORT || 3005,
    db: 'mongodb://localhost/auth_cm'
  }
};

module.exports = config[env];