// Маршруты для обращения к сервису матрицы (БД знания)
var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators'),
    format  = require('./../validators/format');

module.exports = function(app) { 
    app.use('/api/kns', router);
}

// Создание знания
router.post('/create', function(req, res, next) {
    const data = {
        name: req.body.name, 
        ctgr: req.body.ctgr,
        sctgr: req.body.sctgr,
        marks: req.body.marks
    };
    
    crd.CreateKn(data, function(err, st, response) {
        res.status(st).send(format.Data(response));
    });
});

// Получение всех знаний из базы
router.get('/', function(req, res, next) {
    crd.GetKns(req.query.page, req.query.count, function(err, st, response){
        res.status(st).send(format.Data(response));
    });
});

// Получение знания по id
router.get('/:id', function(req, res, next) {
    crd.GetKnById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(response));
    });
});

// Обновление знания по id
router.put('/:id', function(req, res, next) {
    let data = {
        name: req.body.name,
        ctgr: req.body.ctgr, 
        sctgr: req.body.sctgr,
        marks: req.body.marks
    };
    
    crd.UpdateKn(req.params.id, data, function(err, st, response) {
        res.status(st).send(format.Data(response));
    });
});

// Удаление всех знаний из базы
router.delete('/', function(err, st, res) {
    crd.DeleteKns(function(err, st, response) {
        res.status(st).send(format.Data(response));
    });
});

// Удаление знания по id
router.delete('/:id', function(req, res, next) {
    crd.DeleteKnById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(response));
    });
});