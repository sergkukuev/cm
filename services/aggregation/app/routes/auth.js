// Маршруты для обращения к сервису авторизации
var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators');

module.exports = function(app) { 
    app.use('/api/auth', router);
}

// Авторизация логин/пароль
router.post('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const data = {
        login: req.body.login,
        password: req.body.password
    };
    return crd.GetTokenByPass(data, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});

// Авторизация по токену
router.post('/token', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    let auth = req.headers.authorization;
    const data = {
        refresh_token: auth.split(' ')[1]
    };
    return crd.GetTokenByToken(data, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        response.entryData = data;  // Добавляем значение токена
        return res.status(status).send(response);
    });
});

// OAUTH2 авторизация (через внешний ресурс)
// Данные агрегатора
const application = {
    id: require('./../../config').app.id,
    secret: require('./../../config').app.secret
};

// Переадресация на фрейм сервиса авторизации
router.get('/oauth2', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const authUrl = 'http://localhost:3005/api/auth/authorization?';
    const redUrl = 'http://localhost:3000/api/code';
    const params = ['response_type=code', 'app_id=' + application.id, 'redirect_uri=' + redUrl];
    const uri = authUrl + params.join('&');
    return res.status(302).redirect(uri);
});

// Авторизация по коду
router.get('/code', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const data = {
        code: req.query.code
    };
    crd.GetTokenByCode(data, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
})

// Проверка авторизации пользователя перед выполнением операции
// Экспортируем, чтобы другие маршруты могли ее брать
module.exports.Check = function (authorization, callback) {
    log.info('Checking authorization');
    if (!authorization)
        return callback(new Error('No token'), 401, null);
    const data = {
        token: authorization.split(' ')[1]
    };
    if (!data.token || data.token.length == 0 || typeof(data.token) === 'undefined')
        return callback(new Error('Invalid token'), 401, null);

    // Запрос на проверку авторизации пользователя
    return crd.GetUserInfo(data, function(err, status, response) {
        if (err)
            return callback(err, status, null);
        if (status !== 200) // Пользователь не прошел авторизацию
            return callback(new Error('Access denied'), status, null);
        log.info('Successful authorization');
        return callback(null, status, response);  //Успешно пройденная авторизация
    });
}