var express         = require('express'),
    glob            = require('glob'),
    favicon         = require('serve-favicon'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    compress        = require('compression'),
    methodOverride  = require('method-override'),
    log             = require('./log')(module),
    cors            = require('cors');

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

    // 404
    app.use(function(req, res, next) {
        var err = new Error('Route not found');
        err.status = 404;
        return next(err);
    });

    // Завершающий обработчик запросов
    app.use(function(err, request, response, next) {
        let item = {
            status: err.name || 'Error',
            code: err.status || 500,
            message: err.message || 'Unknown error'
        };
        // Обработка уникальных случаев повторной инициализации функций:
        // res.status()
        if (typeof(response.status) != 'function') {
            log.warn('Выявлена попытка повторной инициализации объекта \'status\'');
            response.status = item.code; 
        } else {
            response.status(item.code);
        }
        // Заголовок не пустой, значит запрос уже был отправлен где-то раньше
        if (response._header != null)
            log.warn('Выявлена попытка повторного вызова объекта \'send\'');
        else {
            // res.send()
            if (typeof(response.status) != 'function') {
                log.error('Повторная инициализация объекта \'send\'');
            }
            response.send(item);
        }
    });

    return app;
};