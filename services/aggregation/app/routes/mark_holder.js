// Маршруты для обращения к сервису матрицы (БД оценок)
var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators'),
    format  = require('./../validators/format');

module.exports = function(app) { 
    app.use('/api/marks', router);
}

// Создания держателя оценок пользователя 
router.post('/marks/create', function(req, res, next) {
    const data = {
        id_user: req.body.id_user,
        id_kn: req.body.id_kn,
        marks: req.body.marks
    };

    crd.CreateHMark(data, function(req, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// Получение всех оценок пользователей
router.get('/marks', function(req, res, next) {
    crd.GetHMarks(req.query.page, req.query.count, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// Получение всех оценок одного пользователя по идентификатору
router.get('/marks/:id', function(req, res, next) {
    crd.GetHMarkById(req.params.id, function(err1, st1, user) {
        crd.GetKns(0, 0, function(err2, st2, kns) {
            let res1 = format.Data(err1, user);
            let res2 = format.Data(err2, kns);
            if (res1 == user && res2 == kns && st1 == st2)
                res.status(200).send(format.MarkArray(user, kns));
            else if (res2 == err2)
                res.status(st2).send(res2);
            else if (res1 == err1)
                res.status(st1).send(res1);
        });
    });
});

// Обновление оценок
router.put('/marks/', function(req, res, next) {
    const data = {
        id_user: req.body.id_user,
        id_kn: req.body.id_kn,
        marks: req.body.marks
    };

    crd.UpdateHMark(data, function(req, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// Удаление оценок пользователя
router.delete('/marks/:id', function(req, res, next) {
    crd.DeleteHMarkById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});