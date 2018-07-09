var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    work = mongoose.model('Work'), 
    validator = require('./../validators'), 
    myJSON = require('./../validators/format'),
    desc = require('./../validators/status');


module.exports = function(app) {
    app.use('/api/cm/work', router);
};

router.post('/create', function(req, res, next) {
    // Структура  поставленных задач для работы
    let tname = req.body.tname;     // Все имена задач
    let trank = req.body.trank;     // Все ранги задач
    let num_kn = req.body.num_kn;   // Количество знаний для этих задач
    let id_kn = req.body.id_kn;     // Идентификаторы знаний
    let mark = req.body.marks;       // Требуемые их оценки

    /*console.log(tname);
    console.log(trank);
    console.log(num_kn);
    console.log(id_kn);
    console.log(mark);*/

    // Проверка наличия параметров
    if (validator.checkUndefined(tname))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("tname")));
    if (validator.checkUndefined(trank))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("trank")));
    if (validator.checkUndefined(num_kn))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("num_kn")));
    if (validator.checkUndefined(id_kn))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("id_kn")));
    if (validator.checkUndefined(mark))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("marks")));
    // Принадлежность даннных к типу массива
    if (!tname instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("tname")));
    if (!trank instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("trank")));
    if (!num_kn instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("num_kn")));
    if (!id_kn instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("id_kn")));
    if (!mark instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("marks")));

    // Проверка на соразмерность
    if (tname.length != trank.length || trank.length != num_kn.length || tname.length != num_kn.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzEqual("tname", "trank", "num_kn")));
    if (id_kn.length != mark.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzEqual("id_kn", "marks")));
    // Проверка количество знаний для всех задач
    let num = 0;
    for (let i = 0; i < num_kn.length; i++) {
        let temp = validator.checkInt(num_kn[i]);
        if (temp == undefined)
            return res.status(400).send(myJSON.BadRequest(desc.incorrectData("num_kn")));
        num += temp;
    }
    if (num != id_kn.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzKnowledge("num_kn", "id_kn")));
    
    // Формируем массив с подготовленными задачами
    let tasks = [];
    let shift = 0;  // Смещение в массиве знаний и их рангов
    for (let i = 0; i < tname.length; i++) {
        let item = {};
        item["name"] = tname[i];
        item["rank"] = trank[i];
        let need = [];
        let numeric = validator.checkInt(num_kn[i]);
        for (let j = 0; j < numeric; j++) {
            if (validator.checkKnRepeat(id_kn[j + shift], id_kn.slice(shift, numeric + shift)))
                return res.status(400).send(myJSON.BadRequest("Неоднозначность оценки знания (" + id_kn[j + shift] + ") в одной из задач"));
            let knowledge = {
                id_knowledge: id_kn[j + shift],
                mark: mark[j + shift]
            }
            need.push(knowledge);
        }
        shift += numeric;
        item["need"] = need;
        tasks.push(item);
    }
    // Закидываем работы в базу
    data = new work({
        name: req.body.name,
        tasks: tasks
    });
    work.create(data, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            res.status(201).send(myJSON.Data(result));
    });
});

router.get('/', function(req, res, next) {
    const count = validator.parsePageOrCount(req.query.count);
    const page = validator.parsePageOrCount(req.query.page);

    if (page < 0 || count < 0)
        return res.status(400).send(myJSON.BadRequest(desc.pcNegative));

    work.get(page, count, function(err, result){
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
        res.status(200).send(myJSON.Data(result));
    });
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.incorrectID));

    work.getById(id, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            (result ? res.status(200).send(myJSON.Data(result)) : 
                res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
    });
});

router.put('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.incorrectID));
    
    // Структура  поставленных задач для работы
    let tname = req.body.tname;     // Все имена задач
    let trank = req.body.trank;     // Все ранги задач
    let num_kn = req.body.num_kn;   // Количество знаний для этих задач
    let id_kn = req.body.id_kn;     // Идентификаторы знаний
    let mark = req.body.marks;      // Требуемые их оценки

    /*console.log(tname);
    console.log(trank);
    console.log(num_kn);
    console.log(id_kn);
    console.log(mark);*/

    // Проверка наличия параметров
    if (validator.checkUndefined(tname))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("tname")));
    if (validator.checkUndefined(trank))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("trank")));
    if (validator.checkUndefined(num_kn))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("num_kn")));
    if (validator.checkUndefined(id_kn))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("id_kn")));
    if (validator.checkUndefined(mark))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("marks")));
    // Принадлежность даннных к типу массива
    if (!tname instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("tname")));
    if (!trank instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("trank")));
    if (!num_kn instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("num_kn")));
    if (!id_kn instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("id_kn")));
    if (!mark instanceof Array)
        return res.status(400).send(myJSON.BadRequest(desc.ObjArray("marks")));

    // Проверка на соразмерность
    if (tname.length != trank.length || trank.length != num_kn.length || tname.length != num_kn.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzEqual("tname", "trank", "num_kn")));
    if (id_kn.length != mark.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzEqual("id_kn", "marks")));
    // Проверка количество знаний для всех задач
    let num = 0;
    for (let i = 0; i < num_kn.length; i++) {
        let temp = validator.checkInt(num_kn[i]);
        if (temp == undefined)
            return res.status(400).send(myJSON.BadRequest(desc.incorrectData("num_kn")));
        num += temp;
    }
    if (num != id_kn.length)
        return res.status(400).send(myJSON.BadRequest(desc.SzKnowledge("num_kn", "id_kn")));

    // Формируем массив с подготовленными задачами
    let tasks = [];
    let shift = 0;  // Смещение в массиве знаний и их рангов
    for (let i = 0; i < tname.length; i++) {
        let item = {};
        item["name"] = tname[i];
        item["rank"] = trank[i];
        let need = [];
        let numeric = validator.checkInt(num_kn[i]);
        for (let j = 0; j < numeric; j++) {
            if (validator.checkKnRepeat(id_kn[j + shift], id_kn.slice(shift, numeric + shift)))
                return res.status(400).send(myJSON.BadRequest("Неоднозначность оценки знания (" + id_kn[j + shift] + ") в одной из задач"));
            let knowledge = {
                id_knowledge: id_kn[j + shift],
                mark: mark[j + shift]
            }
            need.push(knowledge);
        }
        shift += numeric;
        item["need"] = need;
        tasks.push(item);
    }
    data = {
        name: req.body.name,
        tasks: tasks
    };

    work.update(id, data, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            (result ? res.status(202).send(myJSON.Data(result)) : 
                res.status(404).send(myjson.NotFound(desc.NoFoundObj(id))));
    });
});

router.delete('/', function(req, res, next) {
    work.delete(function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            res.status(200).send(myJSON.Status("Ok", desc.opDel));
    });
});

router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.incorrectID));

    work.deleteById(id, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            (work ? res.status(200).send(myJSON.Status("Ok", desc.ObjDeleted(id))) : 
                res.status(404).send(myJSON.NotFound(desc.NoFoundObj(id))));
    });
});