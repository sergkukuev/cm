var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    knowledge = mongoose.model('Knowledge'), 
    validator = require('./../validators'), 
    myJSON = require('./../format');

module.exports = function(app) {
    app.use('/api/cm/knowledge', router);
};

router.post('/create', function(req, res, next) {
    // Проверка массива оценок знания. Должно быть четко 4 уровня квалификации
    if (validator.checkUndefined(req.body.marks))
        return res.status(400).send(myJSON.Status("Error", "Missing value \'marks\'"));
    if (!validator.checkMarks(req.body.marks))
        return res.status(400).send(myJSON.Status("Error", "Marks should be an array with a length of 4"));
        
    let data = new knowledge({
        name: req.body.name,
        category: req.body.ctgr,
        sub_category: req.body.sctgr,
        marks: req.body.marks
    });

    knowledge.create(data, function(err, result) {
        err ? res.status(400).send(myJSON.Status("Error", err)) :
            res.status(201).send(myJSON.Data(result));
    });
});

router.get('/', function(req, res, next) {
    const count = validator.parsePageOrCount(req.query.count); 
    const page = validator.parsePageOrCount(req.query.page);

    if (page < 0 || count < 0)
        return res.status(400).send(myJSON.Status("Error", "Parameters \'page\' and \'count\' mustn\'t be negative"));

    knowledge.read(page, count, function(err, result) {
        err ? res.status(400).send(myJSON.Status("Error", err)) : 
            res.status(200).send(myJSON.Data(result));
    });
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.Status("Error", "Incorrect ID"));

    knowledge.readById(id, function(err, result) {
        err ? res.status(400).send(myJSON.Status("Error", err)) :
            (result ? res.status(200).send(myJSON.Data(result)) : res.status(404).send(myJSON.Status("Error", "Object by id (" + id + ") doesn\'t exist")));
    });
});

router.put('/:id', function(req, res, next) { 
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.Status("Error", "Incorrect ID"));
        
    let data = {};
    if (!validator.checkUndefined(req.body.marks)) {
        if (!validator.checkMarks(req.body.marks))
            return res.status(400).send(myJSON.Status("Error", "Marks should be an array with a length of 4"));
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
        return res.status(200).send(myJSON.Status("Ok", "There are no new values"));

    knowledge.updateById(id, data, function(err, result) {
        err ? res.status(400).send(myJSON.Status("Error", err)) : 
        (result ? res.status(202).send(myJSON.Data(result)) : res.status(404).send(myJSON.Status("Error", "Object by id (" + id + ") doesn\'t exist")));
    });
});

router.delete('/', function(req, res, next) {
	knowledge.delete(function(err, result) {
		err ? res.status(400).send(myJSON.Status("Error", err)) : res.status(200).send(myJSON.Status("Ok", "Operation \'delete\' completed successfully"))
	});
});

router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.Status("Error", "Incorrect ID"));

	knowledge.delById(id, function(err, result) {
		err ? res.status(400).send(myJSON.Status("Error", err)) :
			(knowledge ? res.status(200).send(myJSON.Status("Ok", "Data by id (" + id + ") deleted")) : res.status(404).send(myJSON.Status("Error", "Object by id (" + id + ") not found")));
	});
});

