var express = require('express'),
    router  = express.Router(),
    mongoose = require('mongoose'),
    mHolder = mongoose.model('MarkHolder'), 
    validator = require('./../validators'), 
    format = require('./../validators/format'),
    passport = require('./../passport'),
    desc = require('./../validators/status');

module.exports = function(app) {
    app.use('/api/cm/users', router);
};

router.post('/create', function(req, res, next) {
    passport.checkServiceAuthorization(req, res, function (scope) {
        let user_id = req.body.id_user;
        let kns = req.body.id_kn;
        let marks = req.body.marks;

        if (!validator.checkId(user_id))
            return res.status(400).send(format.T(400, desc.InvalidId(user_id)));

        if (kns.length != marks.length)
            return res.status(400).send(format.T(400, desc.SzEqual("id_kn", "marks")));
        
        let test = [];
        for (let i = 0; i < kns.length; i++) {
            if (!validator.checkId(kns[i]))
                return res.status(400).send(format.T(400, desc.InvalidId(kns[i])));
            if (validator.checkKnRepeat(kns[i], kns)) {
                let msg = "Неоднозначность оценки знания (" + req.body.id_kn[j] + ")";
                return res.status(400).send(format.T(400, msg));
            }
            let temp = {
                id_knowledge: kns[i],
                mark: marks[i]
            }
            test.push(temp);
        }

        // TODO: Проверка на существующий идентификатор пользователя. Если он уже добавлен в эту базу
        mHolder.get(0, 0, function(err, result) {
            if (err)
                return res.status(400).send(format.T(400, err));
            else {
                let flag = true;
                for (let i = 0; i < result.length && flag; i++)
                    if (result[i].id == user_id)
                        flag = false;
                if (!flag)
                    return res.status(400).send(format.T(400, "Информация о данном пользователе уже существует"));
            }
        });

        let data = new mHolder({
            id_user: user_id,
            test: test
        });
        mHolder.create(data, function(err, result) {
            err ? res.status(400).send(format.T(400, err)) : 
                res.status(201).send(format.Data(result, scope));
        });
    });
});

router.get('/', function(req, res, next) {
    passport.checkServiceAuthorization(req, res, function (scope) {
        const page = validator.parsePageOrCount(req.query.page);
        const count = validator.parsePageOrCount(req.query.count);
        if (page < 0 || count < 0)
            return res.status(400).send(format.T(400, desc.PCNegative));

        mHolder.get(page, count, function(err, result){
            err ? res.status(400).send(format.T(400, err)) : 
                (result ? res.status(200).send(format.Data(result, scope)) : 
                    res.status(404).send(format.T(400, desc.LossData)));
        });
    });
});

router.get('/:id', function(req, res, next) {
    passport.checkServiceAuthorization(req, res, function (scope) {
        const id = req.params.id;
        if (!validator.checkId(id))
            return res.status(400).send(format.T(400, desc.InvalidId(id)));

        mHolder.getByUserId(id, function(err, result) {
            err ? res.status(400).send(format.T(400, err)) :
                (result ? res.status(200).send(format.Data(result, scope)) : 
                    res.status(404).send(format.T(404, desc.NotFound(id))));
        });
    });
});

router.put('/:id', function(req, res, next) {
    passport.checkServiceAuthorization(req, res, function (scope) {
        const id = req.params.id;
        if (!validator.checkId(id))
            return res.status(400).send(format.T(400, desc.InvalidId(id)));
        
        let kns = req.body.id_kn;
        let marks = req.body.marks;
        if (validator.checkUndefined(kns))
            return res.status(400).send(format.T(400, desc.NoKey("id_kn")));
        if (validator.checkUndefined(marks))
            return res.status(400).send(format.T(400, desc.NoKey("marks")));
        if (!kns instanceof Array)
            return res.status(400).send(format.T(400, desc.ObjArray("id_kn")));
        if (!marks instanceof Array)
            return res.status(400).send(format.T(400, desc.ObjArray("marks")));

        if (kns.length != marks.length)
            return res.status(400).send(format.T(400, desc.SzNotEqual("id_kn", "marks")));

        let test = [];
        for (let i = 0; i < kns.length; i++) {
            if (validator.checkKnRepeat(kns[i], kns)) {
                let msg = "Неоднозначность оценки знания (" + kns[i] + ")"
                return res.status(400).send(format.T(400, msg));
            }
            let temp = {
                id_knowledge: kns[i],
                mark: marks[i]
            }
            test.push(temp);
        }

        let data = {
            test: test
        };
        /*if (validator.checkUndefined(req.body.user_id)) {
            let user_id = req.body.user_id;
            if (validator.checkId(req.body.user_id))
                return res.status(400).send(format.T(400, desc.InvalidId(user_id)));
            data["id_user"] = user_id; 
            mHolder.updateByUserId(id, data, function(err, result) {
                err ? res.status(400).send(format.T(400, err)) : 
                    (result ? res.status(202).send(format.Data(result, scope)) : 
                        res.status(404).send(format.T(404, desc.NotFound(id))));
            });
        }
        else {*/
            mHolder.updateByUserId(id, data, function(err, result) {
                err ? res.status(400).send(format.T(400, err)) : 
                    (result ? res.status(202).send(format.Data(result, scope)) : 
                        res.status(404).send(format.T(404, desc.NotFound(id))));
            });
        //}
    });
});

router.delete('/', function(req, res, next) {
    passport.checkServiceAuthorization(req, res, function (scope) {
        mHolder.delete(function(err, st) {
            err ? res.status(400).send(format.T(400, err)) :
                res.status(200).send(format.T(200, desc.Deleted(st.result.n)));
        });
    });
});

router.delete('/:id', function(req, res, next) {
    passport.checkServiceAuthorization(req, res, function (scope) {
        const id = req.params.id;
        if (!validator.checkId(id))
            res.status(400).send(format.T(400, desc.InvalidId(id)));

        mHolder.deleteById(id, function(err, result) {
            err ? res.status(400).send(format.T(400, err)) :
                (result ? res.status(200).send(format.T(200, desc.ObjDeleted(id))) :
                    res.status(404).send(format.T(404, desc.NotFound(id))));
        });
    });
});