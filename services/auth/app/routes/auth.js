// Маршруты авторизации
const   express   = require('express'),
        router    = express.Router(),
        log       = require('./../../config/log')(module),
        validator = require('./../validators'),
        passport  = require('./../passport');

// Форматирование данных перед отправкой
let TError  = require('./../validators/format').TError,
    TData   = require('./../validators/format').TData;

module.exports = (app) => {
    app.use('/api/auth', router);
};

// Получить код авторизации
router.put('/code', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.ServiceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);
        const data = {
            login: validator.Validity(req.body.login),
            password: validator.Validity(req.body.password),
            response_type: validator.ResponseType(req.body.grant_type)
        };
        if (!data.login || !data.pass)
            return next(TError(null, true, 'Login or password is undefined', 400, scope));
        passport.GetUserCode(data, function(err, code) {
            if (err)
                return next(err);
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(202).send(TData({ code: code }, scope));
        });
    });
});

// Получить токен авторизации
router.post('/token', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.ServiceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);
        let type = validator.ResponseType(req.body.grant_type);
        if (type === 'code') {
            return codeAuthorization(req, res, next, scope);
        } else if (type === 'refresh_token') {
            return rTokenAuthorization(req, res, next, scope); 
        } else if (type === 'password') {
            return passAuthorization(req, res, next, scope);
        } else {
            return next(TError(null, true, 'Parameter "grant_type" is undefined', 400, scope));
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Авторизация по коду
function codeAuthorization(req, res, next, service_scope) {
    log.info('Code authorization');
    const code = validator.Validity(req.body.code);
    if (!code)
        return next(TError(null, true, 'Login or password is undefined', 400, service_scope));
    return passport.SetUTokenByCode(code, function(err, status, user_scope) {
        if (err) 
            return next(TError(err, true, err.status || status, scope));
        if (!user_scope)
            return next(TError(null, true, 'User for this password and login is not found', status, service_scope));

        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(200).send(TData(user_scope, service_scope));
    });
}

// Авторизация по паролю
function passAuthorization(req, res, next, service_scope) {
    log.info('Password authorization');
    const data = {
        login: validator.Validity(req.body.login), 
        pass: validator.Validity(req.body.password)
    };
    if (!data.login || !data.pass)
        return next(TError(null, true, 'Login or password is undefined', 400, service_scope));
    return passport.SetUTokenByPass(data, function(err, status, user_scope) {
        if (err)
            return next(TError(err, true, err.status || status, scope));
        if (!user_scope)
            return next(TError(null, true, 'User for this password and login is not found', status, service_scope));
        
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(200).send(TData(user_scope, service_scope));
    });
}

// Авторизация по токену
function rTokenAuthorization(req, res, next, service_scope) {
    log.info('Token authorization');
    const token = validator.Validity(req.body.refresh_token);
    if (!token)
        return next(TError(null, true, 'Token is undefined', 400, service_scope));
    return passport.SetUTokenByToken(token, function(err, status, user_scope) {
        if (err)
            return next(TError(err, true, err.status || status, scope));
        if (!user_scope)
            return next(TError(null, true, 'User for this password and login is not found', status, service_scope));
        
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(200).send(TData(user_scope, service_scope));
    });
}