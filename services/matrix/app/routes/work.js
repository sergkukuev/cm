var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    work = mongoose.model('Work'),
    task = mongoose.model('Task'), 
    validator = require('./../validators'), 
    myJSON = require('./../format');


module.exports = function(app) {
    app.use('/api/cm/work', router);
};

router.post('/create', function(req, res, next) {
    // Структура  поставленных задач для работы
    let tname = req.body.tname;     // Все имена задач
    let trank = req.body.trank;     // Все ранги задач
    let num_kn = req.body.num_kn;   // Количество знаний для этих задач
    let id_kn = req.body.id_kn;     // Идентификаторы знаний
    let mark = req.body.mark;       // Требуемые их оценки

    /*console.log(tname);
    console.log(trank);
    console.log(num_kn);
    console.log(id_kn);
    console.log(mark);*/

    // Проверка наличия параметров
    if (validator.checkUndefined(tname))
        return res.status(400).send(myJSON.Status("Error", "Missing value \'tname\'"));
    if (validator.checkUndefined(trank))
        return res.status(400).send(myJSON.Status("Error", "Missing value \'trank\'"));
    if (validator.checkUndefined(num_kn))
        return res.status(400).send(myJSON.Status("Error", "Missing value \'num_kn\'"));
    if (validator.checkUndefined(id_kn))
        return res.status(400).send(myJSON.Status("Error", "Missing value \'id_kn\'"));
    if (validator.checkUndefined(mark))
        return res.status(400).send(myJSON.Status("Error", "Missing value \'mark\'"));
    // Принадлежность даннных к типу массива
    if (!tname instanceof Array)
        return res.status(400).send(myJSON.Status("Error", "Paramaters \'tname\' must be an array"));
    if (!trank instanceof Array)
        return res.status(400).send(myJSON.Status("Error", "Paramaters \'trank\' must be an array"));
    if (!num_kn instanceof Array)
        return res.status(400).send(myJSON.Status("Error", "Paramaters \'num_kn\' must be an array"));
    if (!id_kn instanceof Array)
        return res.status(400).send(myJSON.Status("Error", "Paramaters \'id_kn\' must be an array"));
    if (!mark instanceof Array)
        return res.status(400).send(myJSON.Status("Error", "Paramaters \'mark\' must be an array"));

    // Проверка на соразмерность
    if (tname.length != trank.length || trank.length != num_kn.length || tname.length != num_kn.length)
        return res.status(400).send(myJSON.Status("Error", "Size of arrays \'tname\', \'trank\' and \'num_kn\' must be equal"));
    if (id_kn.length != mark.length)
        return res.status(400).send(myJSON.Status("Error", "Size of arrays \'id_kn\' and \'mark\' must be equal"));
    // Проверка количество знаний для всех задач
    let num = 0;
    for (let i = 0; i < num_kn.length; i++) {
        let temp = validator.checkInt(num_kn[i]);
        if (temp == undefined)
            return res.status(400).send(myJSON.Status("Error", "Incorrect data in \'num_kn\'"));
        num += temp;
    }
    if (num != id_kn.length)
        return res.status(400).send(myJSON.Status("Error", "Base amount of knowledge doesn't match. Check \'num_kn\' and \'id_kn\'"));
    
    // Формируем массив с подготовленными задачами
    let data = [];
    let shift = 0;  // Смещение в массиве знаний и их рангов
    for (let i = 0; i < tname.length; i++) {
        let item = {};
        item["name"] = tname[i];
        item["rank"] = trank[i];
        let need = [];
        let numeric = validator.checkInt(num_kn[i]);
        for (let j = 0; j < numeric; j++) {
            let knowledge = {
                id_knowledge: id_kn[j + shift],
                mark: mark[j + shift]
            }
            need.push(knowledge);
        }
        shift += shift;
        item["need"] = need;
        data.push(item);
    }
    // Закидываем задачи в базу
    let rollback = {
        flag: false,
        err: {}
    }
    let ts = [];
    for (let i = 0; i < data.length; i++) {
        let temp = new task(data[i]);
        ts.push(temp._id);  // Добавляем id_task
        task.create(temp, function(err, task) {
            if (err) {
                rollback.flag = true;
                rollback.err = err;
            }
        }); 
        // TODO: Сделать откат операции добавления задач
        if (rollback.flag)
            console.log('ОТКААААААААААААААТ');
    }
    // Закидываем работы в базу
    data = new work({
        name: req.body.name,
        tasks: ts
    });
    work.create(data, function(err, result) {
        err ? res.status(400).send(myJSON.Status("Error", err)) :
            res.status(201).send(myJSON.Data(result));
    });
});
