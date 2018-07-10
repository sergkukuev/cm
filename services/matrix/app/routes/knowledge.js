var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    knowledge = mongoose.model('Knowledge'), 
    validator = require('./../validators'), 
    myJSON = require('./../validators/format'),
    desc = require('./../validators/status');

module.exports = function(app) {
    app.use('/api/cm/knowledge', router);
};

router.post('/create', function(req, res, next) {
    // Проверка массива оценок знания. Должно быть четко 4 уровня квалификации
    if (validator.checkUndefined(req.body.marks))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("marks")));
    else if (!validator.checkMarks(req.body.marks))
        return res.status(400).send(myJSON.BadRequest(desc.szMarks));
        
    let data = new knowledge({
        name: req.body.name,
        category: req.body.ctgr,
        sub_category: req.body.sctgr,
        marks: req.body.marks
    });

    knowledge.create(data, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            res.status(201).send(myJSON.Data(result));
    });
});

router.get('/', function(req, res, next) {
    const count = validator.parsePageOrCount(req.query.count); 
    const page = validator.parsePageOrCount(req.query.page);

    if (page < 0 || count < 0)
        return res.status(400).send(myJSON.BadRequest(desc.pcNegative));

    knowledge.read(page, count, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            res.status(200).send(myJSON.Data(result));
    });
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.BadRequest(desc.incorrectID));

    knowledge.readById(id, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            (result ? res.status(200).send(myJSON.Data(result)) : 
                res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
    });
});

router.put('/:id', function(req, res, next) { 
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.BadRequest(desc.incorrectID));
        
    let data = {};
    if (!validator.checkUndefined(req.body.marks)) {
        if (!validator.checkMarks(req.body.marks))
            return res.status(400).send(myJSON.BadRequest(desc.szMarks));
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
        return res.status(400).send(myJSON.BadRequest(desc.noData));

    knowledge.updateById(id, data, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
        (result ? res.status(202).send(myJSON.Data(result)) : 
            res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
    });
});

router.delete('/', function(req, res, next) {
	knowledge.delete(function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            res.status(200).send(myJSON.Status("Ok", desc.opDel));
	});
});

router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.BadRequest(desc.incorrectID));

	knowledge.delById(id, function(err, result) {
		err ? res.status(400).send(myJSON.BadRequest(err)) :
            (knowledge ? res.status(200).send(myJSON.Status("Ok", desc.ObjDeleted(id))) :
                res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
	});
});

