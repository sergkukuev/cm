var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    knowledge = mongoose.model('Knowledge'), 
    validator = require('./../validators');

module.exports = function(app) {
    app.use('/api/cm/knowledge', router);
};

router.post('/create', function(req, res, next) {
    // Проверка массива оценок знания. Должно быть четко 4 уровня квалификации
    if (validator.checkUndefined(req.body.marks))
        return res.status(400).send(StatusJSON("Error", "Missing value \'marks\'"));
    if (!validator.checkMarks(req.body.marks))
        return res.status(400).send(StatusJSON("Error", "Marks should be an array with a length of 4"));
        
    let data = new knowledge({
        name: req.body.name,
        category: req.body.ctgr,
        sub_category: req.body.sctgr,
        marks: req.body.marks
    });

    knowledge.create(data, function(err, result) {
        err ? res.status(400).send(StatusJSON("Error", err)) :
            res.status(201).send(ResponseJSON(result));
    });
});

router.get('/', function(req, res, next) {
    const count = validator.parsePageOrCount(req.query.count); 
    const page = validator.parsePageOrCount(req.query.page);

    knowledge.read(page, count, function(err, result) {
        err ? res.status(400).send(StatusJSON("Error", err)) : 
            res.status(200).send(ResponseJSON(result));
    });
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(StatusJSON("Error", "Incorrect ID"));

    knowledge.readById(id, function(err, result) {
        err ? res.status(400).send(StatusJSON("Error", err)) :
            (result ? res.status(200).send(ResponseJSON(result)) : res.status(404).send(StatusJSON("Error", "Object by id (' + id + ') doesn\'t exist")));
    });
});

router.put('/:id', function(req, res, next) { 
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(StatusJSON("Error", "Incorrect ID"));
        
    let data = {};
    if (!validator.checkUndefined(req.body.marks)) {
        if (!validator.checkMarks(req.body.marks))
            return res.status(400).send(StatusJSON("Error", "Marks should be an array with a length of 4"));
        data["marks"] = req.body.marks;
    }
    if (!validator.checkUndefined(req.body.name))
        data["name"] = req.body.name;
    if (!validator.checkUndefined(req.body.ctgr))
        data["category"] = req.body.ctgr;
    if (!validator.checkUndefined(req.body.sctgr))
        data["sub_category"] = req.body.sctgr;
    // Не пришли данные для обновления 
    if (Object.keys(data).length == 0)
        return res.status(200).send(StatusJSON("Ok", "There are no new values"));

    knowledge.updateById(id, data, function(err, result) {
        err ? res.status(400).send(StatusJSON("Error", err)) : 
        (result ? res.status(202).send(ResponseJSON(result)) : res.status(404).send(StatusJSON("Error", "Object by id (" + id + ") doesn\'t exist")));
    });
});

router.delete('/', function(req, res, next) {
	knowledge.delete(function(err, result) {
		err ? res.status(400).send(StatusJSON("Error", err)) : res.status(200).send(StatusJSON("Ok", "Operation \'delete\' completed successfully"))
	});
});

router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(StatusJSON("Error", "Incorrect ID"));

	knowledge.delById(id, function(err, result) {
		err ? res.status(400).send(StatusJSON("Error", err)) :
			(knowledge ? res.status(200).send(StatusJSON("Ok", "Data by id (" + id + ") deleted")) : res.status(404).send(StatusJSON("Error", "Object by id (" + id + ") not found")));
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
