var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    mHolder = mongoose.model('MarkHolder'), 
    validator = require('./../validators'), 
    myJSON = require('./../validators/format'),
    desc = require('./../validators/status');

module.exports = function(app) {
    app.use('/api/cm/mark', router);
};

router.post('/create', function(req, res, next) {
    let user_id = req.body.id_user;
    let kns = req.body.id_kn;
    let marks = req.body.marks;

    if (!validator.checkId(user_id))
        return res.status(400).send(myJSON.BadRequest(desc.incorrectID));

    if (kns.length != marks.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzEqual("id_kn", "marks")));
    
    let test = [];
    for (let i = 0; i < kns.length; i++) {
        let temp = {
            id_knowledge: kns[i],
            mark: marks[i]
        }
        test.push(temp);
    }

    let data = new mHolder({
        id_user: user_id,
        test: test
    });
    mHolder.create(data, function(err, mark) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            res.status(200).send(myJSON.Data(mark));
    });
});

router.get('/', function(req, res, next) {
    const count = validator.parsePageOrCount(req.query.count);
    const page = validator.parsePageOrCount(req.query.page);

    if (page < 0 || count < 0)
        return res.status(400).send(myJSON.BadRequest(desc.pcNegative));

    mHolder.get(page, count, function(err, result){
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
        res.status(200).send(myJSON.Data(result));
    });
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.incorrectID));

    mHolder.getById(id, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            (result ? res.status(200).send(myJSON.Data(result)) : 
                res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
    });
});

router.put('/:id', function(req, res, next) {

    mHolder.update(id, data, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            (result ? res.status(202).send(myJSON.Data(result)) : 
                res.status(404).send(myjson.NotFound(desc.NoFoundObj(id))));
    });
});

router.delete('/', function(req, res, next) {
    mHolder.delete(function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            res.status(200).send(myJSON.Status("Ok", desc.opDel));
    });
});

router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.incorrectID));

    mHolder.deleteById(id, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            (work ? res.status(200).send(myJSON.Status("Ok", desc.ObjDeleted(id))) : 
                res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
    });
});