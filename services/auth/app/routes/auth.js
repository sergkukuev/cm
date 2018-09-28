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

// Получить токен авторизации
router.post('/token', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    serviceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);
        let type = req.body.grant_type;
        if (type === 'authorization_code') {
            return codeAuthorization(req, res, next, scope);
        } else if (type === 'refresh_token') {
            return refreshTokenAuthorization(req, res, next, scope); 
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
function refreshTokenAuthorization(req, res, next, service_scope) {
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