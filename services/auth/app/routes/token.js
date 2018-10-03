// Маршруты для работы с токенами
const   router      = require('express').Router(),
        passport    = require('./../passport'),
        validator   = require('./../validators'),
        log         = require('./../../config/log')(module);

// Модели токенов
const   SToken = require('./../models/token').model_s,
        RToken = require('./../models/token').model_r,
        UToken = require('./../models/token').model_u;

// Форматирование данных перед отправкой
let TError  = require('./../validators/format').TError,
    TData   = require('./../validators/format').TData;

module.exports = (app) => {
    app.use('/api/auth/tokens', router);
}

// Получить все токены доступа
router.get('/saccess', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        SToken.Get(function(err, tokens) {
            if (err && err.name == 'TokenError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(tokens, service_scope));
        });
    });
});

// Получить все токены обновления
router.get('/refresh', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        RToken.Get(function(err, tokens) {
            if (err && err.name == 'TokenError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(tokens, service_scope));
        });
    });
});

// Получить все пользовательские токены доступа
router.get('/uaccess', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        UToken.Get(function(err, tokens) {
            if (err && err.name == 'TokenError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(tokens, service_scope));
        });
    });
});

// Получить токены доступа по id пользователя
router.get('/saccess/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        let id = validator.ValidityId(req.params.id);
        if (!id) {
            return next(TError(null, true, 'Invalid parameter "id"', 400, service_scope));
        }
        SToken.GetByUserId(id, function(err, tokens) {
            if (err && err.name == 'TokenError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(tokens, service_scope));
        });
    });
});

// Получить токены обновления по id пользователя
router.get('/refresh/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        let id = validator.ValidityId(req.params.id);
        if (!id) {
            return next(TError(null, true, 'Invalid parameter "id"', 400, service_scope));
        }
        RToken.GetByUserId(id, function(err, tokens) {
            if (err && err.name == 'TokenError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(tokens, service_scope));
        });
    });
});

// Получить пользовательские токены доступа по id пользователя
router.get('/uaccess/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        let id = validator.ValidityId(req.params.id);
        if (!id) {
            return next(TError(null, true, 'Invalid parameter "id"', 400, service_scope));
        }
        UToken.GetByUserId(id, function(err, tokens) {
            if (err && err.name == 'TokenError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(tokens, service_scope));
        });
    });
});

// Удалить все токены доступа
router.delete('/saccess', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        SToken.Clear(function(err, result) {
            if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(result, service_scope));
        });
    });
});

// Удалить все токены обновления
router.delete('/refresh', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        RToken.Clear(function(err, result) {
            if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(result, service_scope));
        });
    });
});

// Удалить все пользовательские токены доступа
router.delete('/uaccess', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) { 
            return next(err);
        }
        UToken.Clear(function(err, result) {
            if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(result, service_scope));
        });
    });
});
