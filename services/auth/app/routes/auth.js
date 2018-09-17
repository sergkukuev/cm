// Маршруты авторизации
const   express   = require('express'),
        router    = express.Router(),
        log       = require('./../../config/log')(module),
        valid     = require('./../validators'),
        passport  = require('./../passport');

module.exports = (app) => {
    app.use('/api/auth', router);
};

// Авторизация через GUI API
router.get('/authorization', function(req, res) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.render('auth', {
        response_type : valid.ResponseType(req.query.response_type),
        redirect_uri  : valid.Validity(req.query.redirect_uri),
        app_id        : valid.Validity(req.query.app_id)
    });
});

// Получить код пользователя
router.post('/login', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const data = {
        response_type : valid.ResponseType(req.body.response_type),
        appId         : valid.Validity(req.body.app_id),
        redirect_uri  : valid.Validity(req.body.redirect_uri),
        login         : valid.Validity(req.body.login),
        password      : valid.Validity(req.body.password)
    };
    if (!data.appId || !data.redirect_uri || !data.response_type)
        return next(TError('Some query parameters are not defined', 401));
    if (!data.login || !data.password) {
        log.warn('Login or password isn\'t defined. Redirect to the authorization page')
        return res.status(401).render('auth', {
            response_type : data.response_type,
            redirect_uri : data.redirect_uri,
            app_id : data.appId
        });
    }
    return passport.GetUserCode(data, function(err, status, result) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        const url = data.redirect_uri + "?code=" + result;
        return res.redirect(302, url);
    });
});

// Получить токен авторизации
router.post('/token', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (valid.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function(err, status, scope) {
            if (err) {
                err.status = err.status || status;
                return next(err);
            }
            if (!scope) {
                return next(TError('Scope is undefined', status || err.status));
            }
            let type = req.body.grant_type;
            if (type === 'authorization_code') {
                return codeAuthorization(req, res, next, scope);
            } else if (type === 'refresh_token') {
                return refreshTokenAuthorization(req, res, next, scope); 
            } else if (type === 'password') {
                return passAuthorization(req, res, next, scope);
            } else {
                return next(TError('Parameter "grant_type" is undefined', 400));
            }
        });
    } else {
        return next(TError('Header "Authorization" is undefined', 401));  
    }
});

// Получить идентификатор пользователя по токену
router.get('/user/id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];

    if (valid.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function(err, status, scope) {
            if (err) {
                err.status = err.status || status;
                return next(err)
            }
            if (!scope) {
                return next(TError('Scope is null', status || err.status));
            }
            const user_auth = req.headers['user-authorization'];
            if (valid.Validity(user_auth) != null) {
                return passport.CheckUserByBearer(user_auth, function(err, status, user) {
                    if (err) {
                        err.status = err.status || status;
                        return next(err)
                    }
                    if (!user) {
                        return next(TError('User is null', status || err.status));
                    }
                    log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    return res.status(200).send({id : user.id});
                });
            }
            return next(TError('Header "user-authorization" is undefined', 401));
        });
    }
    return next(TError('Header "authorization" is undefined', 401));
});

// Авторизация по коду
function codeAuthorization(req, res, next, service_scope) {
    log.info('Code authorization');
    const code = req.body.code;
    if (valid.Validity(code) == null)
        return next(TError('Bad request login or password is undefined', 400));
    return passport.SetUTokenByCode(code, function(err, status, user_scope) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        if (!user_scope)
            return next(TError('User for this password and login is not found', status));
        
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(200).send(TData(user_scope, service_scope));
    });
}

// Авторизация по паролю
function passAuthorization(req, res, next, service_scope) {
    log.info('Password authorization');
    const data = {
        login: req.body.login, 
        pass: req.body.password
    };
    if (valid.Validity(data.login) == null || valid.Validity(data.pass) == null)
        return next(TError('Bad request login or password is undefined', 400));
    return passport.SetUTokenByPass(data, function(err, status, user_scope) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        if (!user_scope)
            return next(TError('User for this password and login is not found', status));
        
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(200).send(TData(user_scope, service_scope));
    });
}

// Авторизация по токену
function refreshTokenAuthorization(req, res, next, service_scope) {
    log.info('Token authorization');
    const token = req.body.refresh_token;
    if (valid.Validity(token) == null)
        return next(TError('Token is undefined', 400));
    return passport.SetUTokenByToken(token, function(err, status, user_scope) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        if (!user_scope)
            return next(TError('User for this password and login is not found', status));
        
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(200).send(TData(user_scope, service_scope));
    });
}

// Формирование ошибки
function TError(message, status) {
    let err = new Error(message);
    err.status = status;
    return err;
}

// Формирование ответа
function TData(content, service) {
    let data = { content: content };
    if (service !== true)
        data.service = service;
    return data;
}

// TODO: ПРИВЕСТИ В НОРМАЛЬНЫЙ ВИД ВСЕ ЭТУ ФИГНЮ
/* const mongoose = require('mongoose');
router.get('/users', function(req, res, next) {
    let model = require('./../models/user').model;
    model.getAll(function(err, result) {
        res.status(200).send(result);
    });
});

router.delete('/users', function(req, res, next) {
    let user = mongoose.model('User');
    user.remove({}, function(err, result) {
        err ? res.status(400).send(err) : res.status(200).send(result);
    });
});

router.post('/users/create', function(req, res, next){
    let User = mongoose.model('User');
    let user = new User({
        login: req.body.login,
        password: req.body.password,
        group: 'Admin'
    });

    User.create(user, function(err, result) {
        res.status(200).send(result);
    });
});

router.get('/access_tokens', function(req, res, next) {
    let model = require('./../models/tokens/users_access').model;
    //model.getByUserId('5a65b6e8df7e862bdcd7f03d', function(err, result) {
     //   return res.status(200).send(result);
    //});
    model.getAll(function(err, result) {
        return res.status(200).send(result);
    });
});

router.get('/refresh_tokens', function(req, res, next) {
    let model = require('./../models/tokens/refresh').model;
    model.getAll(function(err, result) {
        res.status(200).send(result);
    });
}); */