// Маршруты для работы с токенами
const   router  = require('express').Router(),
        log     = require('./../../config/log')(module);
/*
// Модели токенов
const   AToken  = require('./../models/tokens/access').model,
        RToken  = require('./../models/tokens/refresh').model,
        UAToken = require('./../models/tokens/users_access').model;

// Форматирование данных перед отправкой
let TError  = require('./../validators/format').TError,
    TData   = require('./../validators/format').TData;
*/
module.exports = (app) => {
    app.use('/api/auth/tokens', router);
}

// Получить все токены доступа
router.get('/access', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить все токены обновления
router.get('/refresh', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить все пользовательские токены доступа
router.get('/uaccess', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить токены доступа по id пользователя
router.get('/access/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить токены обновления по id пользователя
router.get('/refresh/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить пользовательские токены доступа по id пользователя
router.get('/uaccess/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

//Удалить все токены доступа
router.delete('/access', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Удалить все токены обновления
router.delete('/refresh', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Удалить все пользовательские токены доступа
router.delete('/uaccess', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});