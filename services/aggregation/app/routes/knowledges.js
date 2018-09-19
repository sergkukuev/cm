// Маршруты для обращения к сервису матрицы (БД знания)
var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators'),
    log     = require('./../../config/log')(module);

module.exports = function(app) { 
    app.use('/api/kns', router);
}

// Создание знания
router.post('/create', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const data = {
        name: req.body.name, 
        ctgr: req.body.ctgr,
        sctgr: req.body.sctgr,
        marks: req.body.marks
    };
    crd.CreateKn(data, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});

// Получение всех знаний из базы
router.get('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    crd.GetKns(req.query.page, req.query.count, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});

// Получение знания по id
router.get('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    crd.GetKnById(req.params.id, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});

// Обновление знания по id
router.put('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    let data = {
        name: req.body.name,
        ctgr: req.body.ctgr, 
        sctgr: req.body.sctgr,
        marks: req.body.marks
    };
    crd.UpdateKn(req.params.id, data, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});

// Удаление всех знаний из базы
router.delete('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    crd.DeleteKns(function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});

// Удаление знания по id
router.delete('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    crd.DeleteKnById(req.params.id, function(err, status, response) {
        if (err) {
            err.status = err.status || status;
            return next(err);
        }
        log.info(`SUCCESS - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(status).send(response);
    });
});