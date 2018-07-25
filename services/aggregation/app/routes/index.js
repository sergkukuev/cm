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
        ctgr: req.body.ctgr,
        sctgr: req.body.sctgr,
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
        ctgr: req.body.ctgr, 
        sctgr: req.body.sctgr,
        marks: req.body.marks
    };
    
    crd.UpdateKn(req.params.id, data, function(err, st, response) {
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

    crd.CreateWork(data, function(err, st, response) {
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

router.get('/works/:id/:id_task/marks', function(req, res, next) {

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

// Маршруты для хранилища оценок 
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

router.get('/marks', function(req, res, next) {
    crd.GetHMarks(req.query.page, req.query.count, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});

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

router.delete('/marks/:id', function(req, res, next) {
    crd.DeleteHMarkById(req.params.id, function(err, st, response) {
        res.status(st).send(format.Data(err, response));
    });
});