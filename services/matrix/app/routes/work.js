var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    work = mongoose.model('Work'), 
    validator = require('./../validators'), 
    myJSON = require('./../validators/format'),
    desc = require('./../validators/status');


module.exports = function(app) {
    app.use('/api/cm/works', router);
};

router.post('/create', function(req, res, next) {
    let tasks = parseTasks(req); 
    if (tasks.status == "Error")
        return res.status(400).send(myJSON.BadRequest(tasks.desc));
    if (validator.checkUndefined(req.body.name))
        return res.status(400).send(myJSON.BadRequest(desc.NoKey("name")));

    // Закидываем работы в базу
    let data = new work({
        name: req.body.name,
        tasks: tasks.data
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
        return res.status(400).send(myJSON.BadRequest(desc.PCNegative));

    work.get(page, count, function(err, result){
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            (result ? res.status(200).send(myJSON.Data(result)) : 
                res.status(404).send(myJSON.BadRequest(desc.LossData)));
    });
});

router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.InvalidId(id)));

    work.getById(id, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            (result ? res.status(200).send(myJSON.Data(result)) : 
                res.status(404).send(myJSON.NotFound(desc.NotFound(id))));
    });
});

router.put('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        return res.status(400).send(myJSON.BadRequest(desc.InvalidId(id)));
    
    let data = {};
    if (!validator.checkUndefined(req.body.name))
        data["name"] = req.body.name;
    let ts_flag = false;
    let tasks = {};
    if (!validator.checkUndefined(req.body.tname) || !validator.checkUndefined(req.body.trank))
        ts_flag = true;
    if (!validator.checkUndefined(req.body.num_kn) || !validator.checkUndefined(req.body.id_kn))
        ts_flag = true;
    if (!validator.checkUndefined(req.body.marks))
        ts_flag = true;
    if (ts_flag) {
        tasks = parseTasks(req);
        if (tasks.status == "Error")
            return res.status(400).send(myJSON.BadRequest(tasks.desc));
        else
            data["tasks"] = tasks.data;
    }
    // Не пришли данные для обновления 
    if (Object.keys(data).length == 0)
        return res.status(400).send(myJSON.BadRequest(desc.NoData));

    work.updateById(id, data, function(err, result) {
        err ? res.status(400).send(myJSON.BadRequest(err)) : 
            (result ? res.status(202).send(myJSON.Data(result)) : 
                res.status(404).send(myjson.NotFound(desc.NotFound(id))));
    });
});

router.put('/:id_work/tasks/:id_task', function(req, res, next) {
    const id_work = req.params.id_work;
    const id_task = req.params.id_task;

    if (!validator.checkId(id_work))
        return res.status(400).send(myJSON.BadRequest(desc.InvalidId(id_work)));
    if (!validator.checkId(id_task))
        return res.status(400).send(myJSON.BadRequest(desc.InvalidId(id_task)));

    work.getById(id_work, function(err, result1) {
        if (err)
            res.status(400).send(myJSON.BadRequest(err));
        else if (!result1)
            res.status(404).send(myJSON.NotFound(desc.NotFound(id)));
        else {
            let index = -1;
            for (let i = 0; (i < result1.tasks.length) && index == -1; i++)
                if (result1.tasks[i].id == id_task)
                    index = i;  
            if (index == -1)
                return res.status(404).send(myJSON.NotFound("Задачи с таким идентификатором не существует в данной работе"));
            if (!validator.checkUndefined(req.body.name))
                result1.tasks[index].name = req.body.name;
            if (!validator.checkUndefined(req.body.rank))
                result1.tasks[index].rank = req.body.rank;

            let fl_kn = validator.checkUndefined(req.body.id_kn);
            let fl_marks = validator.checkUndefined(req.body.marks);
            if (!fl_kn && !fl_marks) {
                if (!req.body.id_kn instanceof Array)
                    return res.status(400).send(myJSON.BadRequest(desc.ObjArray("id_kn")));
                if (!req.body.marks instanceof Array)
                    return res.status(400).send(myJSON.BadRequest(desc.ObjArray("marks")));
                if (req.body.id_kn.length != req.body.marks.length)
                    return res.status(400).send(myJSON.BadRequest(desc.SzNotEqual("id_kn", "marks")));
                let need = [];
                for (let j = 0; j < req.body.id_kn.length; j++) {
                    if (validator.checkKnRepeat(req.body.id_kn[j], req.body.id_kn)) {
                        let msg = "Неоднозначность оценки знания (" + req.body.id_kn[j] + ") в данной задаче";
                        return res.status(400).send(myJSON.BadRequest(msg));
                    }
                    let temp = {
                        id_knowledge: req.body.id_kn[j],
                        mark: req.body.marks[j]
                    }
                    need.push(temp);
                }
                result1.tasks[index].need = need;
            }
            else if (fl_kn)
                return res.status(400).send(myJSON.BadRequest(desc.NoKey("id_kn")));
            else 
                return res.status(400).send(myJSON.BadRequest(desc.NoKey("marks")));

            work.updateById(id_work, result1, function(err, result) {
                err ? res.status(400).send(myJSON.BadRequest(err)) : 
                    (result ? res.status(202).send(myJSON.Data(result)) : 
                        res.status(404).send(myjson.NotFound(desc.NotFound(id))));
            });
        }
    });
});

router.delete('/', function(req, res, next) {
	work.delete(function(err, st) {
        err ? res.status(400).send(myJSON.BadRequest(err)) :
            res.status(200).send(myJSON.Status("Ok", desc.Deleted(st.result.n)));
	});
});

router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    if (!validator.checkId(id))
        res.status(400).send(myJSON.BadRequest(desc.InvalidId(id)));

	work.deleteById(id, function(err, result) {
		err ? res.status(400).send(myJSON.BadRequest(err)) :
            (result ? res.status(200).send(myJSON.Status("Ok", desc.ObjDeleted(id))) :
                res.status(404).send(myJSON.NotFound(desc.NotFound(id))));
	});
});

// Парсинг списка задач из запроса
function parseTasks(req) {
    let res = {};   // Структура ответа
    // Структура  поставленных задач для работы
    let tname = req.body.tname;     // Все имена задач
    let trank = req.body.trank;     // Все ранги задач
    let num_kn = req.body.num_kn;   // Количество знаний для этих задач
    let id_kn = req.body.id_kn;     // Идентификаторы знаний
    let mark = req.body.marks;      // Требуемые их оценки

    let err = [];   // Список ошибок
    // Проверка наличия параметров
    if (validator.checkUndefined(tname))
        err.push(desc.NoKey("tname"));
    if (validator.checkUndefined(trank))
        err.push(desc.NoKey("trank"));
    if (validator.checkUndefined(num_kn))
        err.push(desc.NoKey("num_kn"));
    if (validator.checkUndefined(id_kn))
        err.push(desc.NoKey("id_kn"));
    if (validator.checkUndefined(mark))
        err.push(desc.NoKey("marks"));
    if (err.length != 0) {
        res["status"] = "Error";
        res["desc"] = err;
        return res;
    }

    // Принадлежность даннных к типу массива
    if (!tname instanceof Array)
        err.push(desc.ObjArray("tname"));
    if (!trank instanceof Array)
        err.push(desc.ObjArray("trank"));
    if (!num_kn instanceof Array)
        err.push(desc.ObjArray("num_kn"));
    if (!id_kn instanceof Array)
        err.push(desc.ObjArray("id_kn"));
    if (!mark instanceof Array)
        err.push(desc.ObjArray("marks"));
    if (err.length != 0) {
        res["status"] = "Error";
        res["desc"] = err;
        return res;
    }

    // Проверка на соразмерность
    if (tname.length != trank.length || trank.length != num_kn.length || tname.length != num_kn.length)
        err.push(desc.SzNotEqual("tname", "trank", "num_kn"));
    if (id_kn.length != mark.length)
        err.push(desc.SzNotEqual("id_kn", "marks"));
    if (err.length != 0) {
        res["status"] = "Error";
        res["desc"] = err;
        return res;
    }
    // Проверка количество знаний для всех задач
    let num = 0;
    for (let i = 0; i < num_kn.length; i++) {
        let temp = validator.checkInt(num_kn[i]);
        if (temp == undefined) {
            res["status"] = "Error";
            res["desc"] = desc.IncorrectData("num_kn");
            return res;    
        }
        num += temp;
    }
    if (num != id_kn.length) {
        let msg = "Количество требуемых знаний не совпадает. Проверьте следующие параметры (\'num_kn\', \'id_kn\')";
        res["status"] = "Error";
        res["desc"] = msg;
        return res;
    }
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
            if (!validator.checkId(id_kn[j + shift])) {
                res["status"] = "Error";
                res["desc"] = desc.InvalidId(id_kn[j + shift]);
            }
            if (validator.checkKnRepeat(id_kn[j + shift], id_kn.slice(shift, numeric + shift))) {
                let msg = "Неоднозначность оценки знания (" + id_kn[j + shift] + ") в одной из задач";
                res["status"] = "Error";
                res["desc"] = msg;
                return res;
            }
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
    res["status"] = "Ok";
    res["data"] = tasks;
    return res;
}