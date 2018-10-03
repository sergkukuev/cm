// Маршруты работы с админами
const   router      = require('express').Router(),
        passport    = require('./../passport'),
        log         = require('./../../config/log')(module);

const   User = require('./../models/user').model,
        userGroups = require('./../models/user').groups;

module.exports = (app) => {
    app.use('/api/auth/admins', router);
};

// Создать админа
router.post('/create', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить всех администраторов
router.get('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        User.GetByGroup(userGroups[1], function(err, admins) {
            if (err && err.name == 'UserError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(admins, service_scope));
        });
    });
});

// Получить информацию админа по id
router.get('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        let id = validator.ValidityId(req.params.id);
        if (!id) {
            return next(TError(null, true, 'Invalid parameter "id"', 400, service_scope));
        }
        User.GetById(id, function(err, admin) {
            if (err && err.name == 'UserError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            } else if (admin.group != userGroups[1]) {
                return next(TError(null, true, 'Admin not found', 404, service_scope));
            }
            log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(200).send(TData(admin, service_scope));
        });
    });
});

// Обновление информации админа по id
/*router.put('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        let id = validator.ValidityId(req.params.id);
        if (!id) {
            return next(TError(null, true, 'Invalid parameter "id"', 400, service_scope));
        }
        User.GetById(id, function(err, user) {
            if (err && err.name == 'UserError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            } else if (admin.group != userGroups[1]) {
                return next(TError(null, true, 'Admin not found', 404, service_scope));
            }
            // TODO: Составить данные на обновление
            let data = {};
            User.UpdateById(id, data, function(err, user) {
                if (err) {
                    return next(TError(err, false, err.status || 500, service_scope));;
                } 
                log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return res.status(202).send(TData(user, service_scope));
            });
        });
    });
});*/

// Удалить админа
router.delete('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    passport.SAAuth(req.headers, function(err, service_scope, admin_scope) {
        if (err) {
            return next(err);
        }
        let id = validator.ValidityId(req.params.id);
        if (!id) {
            return next(TError(null, true, 'Invalid parameter "id"', 400, service_scope));
        }
        User.GetById(id, function(err, user) {
            if (err && err.name == 'UserError') {
                return next(TError(err, false, err.status || 404, service_scope));
            } else if (err) {
                return next(TError(err, false, err.status || 500, service_scope));;
            } else if (admin.group != userGroups[1]) {
                return next(TError(null, true, 'Admin not found', 404, service_scope));
            }
            User.DeleteById(user._id, function(err, result){
                if (err && err.name == 'UserError') {
                    return next(TError(err, false, err.status || 404, service_scope));
                } else if (err) {
                    return next(TError(err, false, err.status || 500, service_scope));;
                } 
                log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return res.status(200).send(TData(result, service_scope));
            });
        });
    });
});