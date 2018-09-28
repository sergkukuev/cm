// Маршруты работы с пользователями
const   router    = require('express').Router(),
        log       = require('./../../config/log')(module),
        validator = require('./../validators'),
        passport  = require('./../passport');

// Форматирование данных перед отправкой
let TError  = require('./../validators/format').TError,
    TData   = require('./../validators/format').TData;

module.exports = (app) => {
    app.use('/api/auth/users', router);
};

// Создать пользователя
router.post('/create', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить всех пользователей
router.get('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить идентификатор пользователя по токену
router.get('/id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    serviceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);

        const user_auth = validator.Validity(req.headers['user-authorization']);
        if (!user_auth)
            return next(TError(null, true, 'Header "user-authorization" is undefined', 401, scope));
        return passport.CheckUserByBearer(user_auth, function(err, status, user) {
            if (err)
                return next(TError(err, true, err.status || status, scope));
            if (!user)
                return next(TError(null, true, 'User is null', status, scope));

            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData({id : user.id}, scope));
        });
    });
});

// Получить информацию пользователя по id
router.get('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Обновление информации пользователя по id
router.put('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Удалить всех пользователей
router.delete('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Удалить пользователя по id
router.delete('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Проверка сервисной авторизации
function serviceAuth(header_auth, callback) {
    if (validator.Validity(header_auth)) {
        return passport.CheckServiceAuth(header_auth, function(err, status, scope) {
            if (err || !scope) {
                err ? callback(TError(err, true, err.status || status, scope), null) :
                    callback(TError(null, true, 'Scope is null', status), null);
                return;
            }
        });
    }
    return callback(TError(null, true, 'Header "authorization" is undefined', 401), null);  
}