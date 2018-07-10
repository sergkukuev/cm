var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators'),
    format  = require('./../validators/format');

module.exports = function(app) { 
    app.use('/api', router);
}
// Маршруты для знаний
router.post('/kns/create', function(req, res, next) {
    const data = {
        name: req.body.name, 
        category: req.body.ctgr,
        sub_category: req.body.sctgr,
        marks: req.body.marks
    };
    
    crd.CreateKn(data, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

router.get('/kns', function(req, res, next) {
    crd.GetKns(req.query.page, req.query.count, function(err, st, response){
        res.status(st).send(format.Data(err, response));
    });
});

router.get('/kns/:id', function(req, res, next) {
    crd.GetKnById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

router.put('/kns/:id', function(req, res, next) {
    let data = {
        name: req.body.name,
        category: req.body.ctgr, 
        sub_category: req.body.sctgr,
        marks: req.body.marks
    };
    
    crd.UpdateKn(data, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

router.delete('/kns/:id', function(req, res, next) {
    crd.DeleteKnById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

// Маршруты для работ
router.post('/works/create', function(req, res, next) {
    let data = {
        name: req.body.name,
        tname: req.body.tname,
        trank: req.body.trank,
        num_kn: req.body.num_kn,
        id_kn: req.body.id_kn,
        marks: req.body.marks
    };

    crd.CreateWork(data, function(err, res, next) {
        res.status(st).send(format.Data(err, response));
    });
});

router.get('/works', function(req, res, next) {
    crd.GetWorks(req.query.page, req.query.count, function(err, st, response){
        res.status(st).send(format.Data(err, response));
    });
});

router.get('/works/:id', function(req, res, next) {
    crd.GetWorkById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

router.put('/works/:id', function(req, res, next) {
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

router.delete('/works/:id', function(req, res, next) {
    crd.DeleteWorkById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});