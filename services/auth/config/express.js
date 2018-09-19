var express         = require('express'),
    glob            = require('glob'),
    favicon         = require('serve-favicon'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    compress        = require('compression'),
    methodOverride  = require('method-override'),
    log             = require('./log')(module),
    cors            = require('cors'),
    verify          = require('./../app/models/client').VerifyClient;

module.exports = function(app, config) {
    var env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(cors());
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());
    // Установка моделей
    var models = glob.sync(config.root + '/app/models/*.js');
    models.forEach(function (model) {
        require(model);
    });
    // Установка путей
    var routes = glob.sync(config.root + '/app/routes/*.js');
    routes.forEach(function (route) {
        require(route)(app);
    });

    verify('aggregator', 'aggr_id', 'aggr_secret', true);   // Проверка наличия записи о клиенте в бд

    // 404
    app.use(function(req, res, next) {
        var err = new Error('Route not found');
        err.status = 404;
        return next(err);
    });

    // Завершающий обработчик запросов
    app.use(function(err, req, res, next) {
        let item = {
            status: err.name || 'Error',
            code: err.status || 500,
            message: err.message || 'Unknown error',
            service: err.service || 'undefined'
        };
        log.error(`${item.message} - ${item.code} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        log.debug(err.stack);
        // Обработка уникальных случаев повторной инициализации функций:
        // res.status()
        if (typeof(res.status) != 'function') {
            log.warn('Attempt to reinitialize an object \'status\'');
            res.status = item.code; 
        } else {
            res.status(item.code);
        }
        // Заголовок не пустой, значит запрос уже был отправлен где-то раньше
        if (res._header != null)
            log.warn('Attempt to reinitialize an object \'send\'');
        else {
            // res.send()
            if (typeof(res.status) != 'function') {
                log.error('Attempt to reinitialize an object \'send\'');
            }
            res.send(item);
        }
    });

    return app;
};