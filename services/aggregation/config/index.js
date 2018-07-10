var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'aggr'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/aggr'
  }
};

module.exports = config[env];