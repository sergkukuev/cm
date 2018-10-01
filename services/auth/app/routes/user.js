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
    passport.ServiceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);
        return passport.UserAuth(req.headers['user-authorization'], function(err, user) {
            if (err)
                return next(err);
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