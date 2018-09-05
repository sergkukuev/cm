// Маршруты для обращения к сервису матрицы (БД работ)
var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators'),
    format  = require('./../validators/format');

module.exports = function(app) { 
    app.use('/api/works', router);
}

// Создание работы
router.post('/create', function(req, res, next) {
    let data = {
        name: req.body.name,
        tname: req.body.tname,
        trank: req.body.trank,
        num_kn: req.body.num_kn,
        id_kn: req.body.id_kn,
        marks: req.body.marks
    };

    crd.CreateWork(data, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// Получение списка всех работ
router.get('/', function(req, res, next) {
    crd.GetWorks(req.query.page, req.query.count, function(err, st, response){
        res.status(st).send(format.Data(err, response));
    });
});

// Получение работы по id
router.get('/:id', function(req, res, next) {
    crd.GetWorkById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// TODO: Сделать получение всех оценок работы по идентификатору задачи
router.get('/:id/:id_task/marks', function(req, res, next) {

});

// Обновление работы
router.put('/:id', function(req, res, next) {
    let data = {
        name: req.body.name,
        tname: req.body.tname,
        trank: req.body.trank,
        num_kn: req.body.num_kn,
        id_kn: req.body.id_kn,
        marks: req.body.marks
    };
    
    crd.UpdateWork(data, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// Удаление работы
router.delete('/:id', function(req, res, next) {
    crd.DeleteWorkById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});