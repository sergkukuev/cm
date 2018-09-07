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
    // Структура отправки на сервис
    let data = {
        tname: [],
        trank: [],
        num_kn: [],
        id_kn: [],
        marks: []
    };
    // Преобразование
    data['name'] = work.name;
    req.body.tasks.forEach(task => {
      data.tname.push(task.name);
      data.trank.push(task.rank.value);
      data.num_kn.push(task.need.length);
      task.need.forEach(knowledge => {
        data.id_kn.push(knowledge.id);
        data.marks.push(knowledge.mark.value);
      });
    });
    crd.CreateWork(data, function(err, st, response) {
        err ? res.status(st).send(format.T(st, err)) : 
            res.status(st).send(format.Data(response));
    });
});

// Получение списка всех работ
router.get('/', function(req, res, next) {
    crd.GetWorks(req.query.page, req.query.count, function(err, st, response){
        err ? res.status(st).send(format.T(st, err)) : 
            res.status(st).send(format.Data(response));
    });
});

// Получение работы по id
router.get('/:id', function(req, res, next) {
    crd.GetWorkById(req.params.id, function(err, st, response) {
        err ? res.status(st).send(format.T(st, err)) : 
            res.status(st).send(format.Data(response));
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
        err ? res.status(st).send(format.T(st, err)) : 
            res.status(st).send(format.Data(response));
    });
});

// Удаление работы
router.delete('/:id', function(req, res, next) {
    crd.DeleteWorkById(req.params.id, function(err, st, response) {
        err ? res.status(st).send(format.T(st, err)) : 
            res.status(st).send(format.Data(response));
    });
});