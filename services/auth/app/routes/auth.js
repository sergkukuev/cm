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

// Отрисовка GUI API
router.get('/authorization', function(req, res) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.render('auth', {
        response_type : validator.ResponseType(req.query.response_type),
        redirect_uri  : validator.Validity(req.query.redirect_uri),
        app_id        : validator.Validity(req.query.app_id)
    });
});

// Авторизация через GUI API
router.post('/login', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    serviceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);

        const data = {
            response_type : validator.ResponseType(req.body.response_type),
            appId         : validator.Validity(req.body.app_id),
            redirect_uri  : validator.Validity(req.body.redirect_uri),
            login         : validator.Validity(req.body.login),
            password      : validator.Validity(req.body.password)
        };
        if (!data.appId)
            return next(TError(null, true, 'Parameter "app_id" is undefined', 400, scope));
        if (!data.redirect_uri)
            return next(TError(null, true, 'Parameter "redirect_uri" is undefined', 400, scope));
        if (!data.response_type)
            return next(TError(null, true, 'Parameter "response_type" is undefined', 400, scope));
        if (!data.login || !data.password) {
            log.warn('Login or password isn\'t defined. Redirect to the authorization page')
            return res.status(401).render('auth', {
                response_type : data.response_type,
                redirect_uri : data.redirect_uri,
                app_id : data.appId
            });
        }
        return passport.GetUserCode(data, function(err, status, result) {
            if (err)
                return next(TError(err, err.status || status, scope));

            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            const url = data.redirect_uri + "?code=" + result;
            return res.redirect(302, url);
        });
    });
});

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

// Получить идентификатор пользователя по токену
router.get('/user/id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    serviceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);

        const user_auth = validator.Validity(req.headers['user-authorization']);
        if (!user_auth)
            return next(TError(null, true, 'Header "user-authorization" is undefined', 401, scope));
        return passport.CheckUserByBearer(user_auth, function(err, status, user) {
            if (err)
                return next(TError(err, err.status || status, scope));
            if (!user)
                return next(TError(null, true, 'User is null', status, scope));

            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData({id : user.id}, scope));
        });
    });
});

// Получить информацию пользователя по токену 
router.get('/user', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    serviceAuth(req.headers['authorization'], function(err, scope) {
        if (err)
            return next(err);

        const user_auth = validator.Validity(req.headers['user-authorization']);
        if (!user_auth)
            return next(TError(null, true, 'Header "user-authorization" is undefined', 401, scope));
        return passport.CheckUserByBearer(user_auth, function(err, status, user) {
            if (err)
                return next(TError(err, err.status || status, scope));
            if (!user)
                return next(TError(null, true, 'User is null', status, scope));

            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(user, scope));
        });
    });
});

// Авторизация по коду
function codeAuthorization(req, res, next, service_scope) {
    log.info('Code authorization');
    const code = validator.Validity(req.body.code);
    if (!code)
        return next(TError(null, true, 'Login or password is undefined', 400, service_scope));
    return passport.SetUTokenByCode(code, function(err, status, user_scope) {
        if (err) 
            return next(TError(err, err.status || status, scope));
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
            return next(TError(err, err.status || status, scope));
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
            return next(TError(err, err.status || status, scope));
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
                err ? callback(TError(err, err.status || status, scope), null) :
                    callback(TError(null, true, 'Scope is null', status), null);
                return;
            }
        });
    }
    return callback(TError(null, true, 'Header "authorization" is undefined', 401), null);  
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