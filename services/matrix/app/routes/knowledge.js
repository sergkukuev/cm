var express     = require('express'),
    router      = express.Router(),
    mongoose    = require('mongoose'),
    knowledge   = mongoose.model('Knowledge'), 
    validator   = require('./../validators'), 
    T           = require('./../validators/format'),
    passport    = require('./../passport'),
    log         = require('./../../config/log')(module);

module.exports = function(app) {
    app.use('/api/cm/kns', router);
};

// Создать знание
router.post('/create', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (validator.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function (err, status, scope) {
            if (err) {
                err.status = err.status || status;
                err.service = scope;
                return next(err);
            }
            if (!scope) {
                return next(T.Error('Scope is null', status || err.status));
            }
            // Проверка массива оценок знания. Должно быть четко 4 уровня квалификации
            if (validator.IsUndefined(req.body.marks))
                return next(T.Error(NoKey("marks"), 400, scope));
            else if (!validator.CheckMarks(req.body.marks))
                return next(T.Error('Number of marks must be 4', 400, scope));
            
            if (validator.IsUndefined(req.body.name))
                return next(T.Error(NoKey("name"), 400, scope));

            let data = new knowledge({
                name: req.body.name,
                ctgr: req.body.ctgr,
                sctgr: req.body.sctgr,
                marks: req.body.marks
            });

            knowledge.create(data, function(err, result) {
                if (err) {
                    err.status = err.status || 400;
                    err.service = scope;
                    return next(err);
                }
                log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return res.status(201).send(T.Data(result, scope));
            });
        });
    } else {
        return next(T.Error('Header "authorization" is undefined', 401));  
    }
});

// Получить список всех знаний
router.get('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (validator.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function (err, status, scope) {
            if (err) {
                err.status = err.status || status;
                err.service = scope;
                return next(err);
            }
            if (!scope) {
                return next(T.Error('Scope is null', status || err.status));
            }
            const count = validator.CastInt(req.query.count, 0); 
            const page = validator.CastInt(req.query.page, 0);

            if (page < 0 || count < 0)
                return next(T.Error('Parameters \'page\' and \'count\' mustn\'t be a negative', 400, scope));

            knowledge.get(page, count, function(err, result) {
                if (err) {
                    err.status = err.status || 400;
                    err.service = scope;
                    return next(err);
                }
                log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return res.status(200).send(T.Data(result, scope));
            });
        });
    } else {
        return next(T.Error('Header "authorization" is undefined', 401));  
    }
});

// Получить знание по идентификатору
router.get('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (validator.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function (err, status, scope) {
            if (err) {
                err.status = err.status || status;
                err.service = scope;
                return next(err);
            }
            if (!scope) {
                return next(T.Error('Scope is null', status || err.status));
            }
            const id = req.params.id;
            if (!validator.VerifyId(id))
                return next(T.Error(InvalidId(id), 400, scope));

            knowledge.getById(id, function(err, result) {
                if (err) {
                    err.status = err.status || 400;
                    err.service = scope;
                    return next(err);
                }
                if (result) {
                    log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    return res.status(200).send(T.Data(result, scope));
                } else {
                    return next(T.Error(NotFound(id), 404, scope));
                }
            });
        });
    } else {
        return next(T.Error('Header "authorization" is undefined', 401));  
    }
});

// Обновить знание по идентификатору
router.put('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (validator.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function (err, status, scope) {
            if (err) {
                err.status = err.status || status;
                err.service = scope;
                return next(err);
            }
            if (!scope) {
                return next(T.Error('Scope is null', status || err.status));
            }
            const id = req.params.id;
            if (!validator.VerifyId(id))
                return next(T.Error(InvalidId(id), 400, scope));
            
            let data = {};
            if (!validator.IsUndefined(req.body.marks)) {
                if (!validator.CheckMarks(req.body.marks))
                    return next(T.Error('Numbers of marks must be 4', 400, scope));
                data["marks"] = req.body.marks;
            }
            if (!validator.IsUndefined(req.body.name))
                data["name"] = req.body.name;
            if (!validator.IsUndefined(req.body.ctgr))
                data["ctgr"] = req.body.ctgr;
            if (!validator.IsUndefined(req.body.sctgr))
                data["sctgr"] = req.body.sctgr;
            // Не пришли данные для обновления 
            if (Object.keys(data).length == 0)
                return next(T.Error('No data', 400, scope));

            knowledge.updateById(id, data, function(err, result) {
                if (err) {
                    err.status = err.status || 400;
                    err.service = scope;
                    return next(err);
                }
                if (result) {
                    log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    return res.status(202).send(T.Data(result, scope));
                } else {
                    return next(T.Error(NotFound(id), 404, scope));
                }
            });
        });
    } else {
        return next(T.Error('Header "authorization" is undefined', 401));  
    }
});

// Удалить все знания
router.delete('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (validator.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function (err, status, scope) {
            if (err) {
                err.status = err.status || status;
                err.service = scope;
                return next(err);
            }
            if (!scope) {
                return next(T.Error('Scope is null', status || err.status));
            }
            knowledge.delete(function(err, st) {
                if (err) {
                    err.status = err.status || 400;
                    err.service = scope;
                    return next(err);
                }
                log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                return res.status(200).send(T.Data('Deleted ' + st.result.n + ' items', scope));
            });
        });
    } else {
        return next(T.Error('Header "authorization" is undefined', 401));  
    }
});

// Удалить знание по идентификатору
router.delete('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const header_auth = req.headers['authorization'];
    if (validator.Validity(header_auth) != null) {
        return passport.CheckServiceAuth(header_auth, function (err, status, scope) {
            if (err) {
                err.status = err.status || status;
                err.service = scope;
                return next(err);
            }
            if (!scope) {
                return next(T.Error('Scope is null', status || err.status));
            }
            const id = req.params.id;
            if (!validator.VerifyId(id))
                return next(T.Error(InvalidId(id), 400, scope));

            knowledge.deleteById(id, function(err, result) {
                if (err) {
                    err.status = err.status || 400;
                    err.service = scope;
                    return next(err);
                }
                if (result) {
                    log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    return res.status(200).send(T.Data('Deleted ' + st.result.n + ' items', scope));
                } else {
                    return next(T.Error(NotFound(id), 404, scope));
                }
            });
        });
    } else {
        return next(T.Error('Header "authorization" is undefined', 401));  
    }
});

// Описатели распространенных ошибок
// Отсутствие ключа
function NoKey(key) {
    return 'Missing key \'' + key + '\'';
}

// Некорректный идентификатор
function InvalidId(id) {
    return 'Identifier \'' + id + '\' is invalid';
}

// Объект не найден по данному идентификатору
function NotFound(id) {
    return 'Object by \'' + id + '\' not found';
}