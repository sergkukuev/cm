var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    knowledge = mongoose.model('Knowledge');

module.exports = function(app) {
    app.use('/api/cm/knowledge', router);
};

router.post('/create', function(req, res, next) {
    let data = new knowledge({
        name: req.body.name,
        category: req.body.ctgr,
        sub_category: req.body.sctgr,
        marks: req.body.marks
    });

    knowledge.create(data, function(err, result) {
        err ? res.status(400).send(StatusJSON('Error', err)) :
            res.status(201).send(ResponseJSON(result));
    });
});

router.get('/', function(req, res, next) {
    let count = 0;//req.query.page;
    let page = 0;//req.query.count;
    knowledge.read(page, count, function(err, result) {
        err ? res.status(400).send(StatusJSON('Error', err)) : 
            res.status(200).send(ResponseJSON(result));
    });
});

router.get('/:id', function(req, res, next) {
    knowledge.readById(req.params.id, function(err, result) {
        err ? res.status(400).send(StatusJSON('Error', err)) :
            (result ? res.status(200).send(ResponseJSON(result)) : res.status(200).send(StatusJSON('Error', 'Object by id (' + req.params.id + ') doesn\'t exist')));
    });
});

router.put('/:id', function(req, res, next) { 
    let data = {
        name: req.body.name,
        category: req.body.ctgr,
        sub_category: req.body.sctgr,
        marks: req.body.marks
    };

    knowledge.updateById(req.params.id, data, function(err, result) {
        err ? res.status(400).send(StatusJSON('Error', err)) : 
        (knowledge ? res.status(200).send(ResponseJSON(result)) : res.status(404).send(StatusJSON('Error', 'Not found')));
    });
});

router.delete('/', function(req, res, next) {
	knowledge.delete(function(err, result) {
		err ? res.status(400).send(StatusJSON('Error', err)) : res.status(200).send(StatusJSON('Ok', 'All data was deleted'))
	});
});

router.delete('/:id', function(req, res, next) {
	knowledge.delById(req.params.id, function(err, result) {
		err ? res.status(400).send(StatusJSON('Error', err)) :
			(knowledge ? res.status(200).send(StatusJSON('Ok', 'Data by id (' + req.params.id + ') was deleted')) : res.status(404).send(StatusJSON('Error', 'Not found')));
	});
});

// JSON с ответом 
// (для универсальности, в случае добавления новых полей, к примеру токенов для межсервисной авторизации)
function ResponseJSON(data) {
    let item = {

    };
    return data;
}

// JSON со статусом ошибки
function StatusJSON(st, desc) {
	let item = {
		status: st,
		description: desc
	};
	return item;
}
