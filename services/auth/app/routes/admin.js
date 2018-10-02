// Маршруты работы с админами
const   router = require('express').Router(),
        log    = require('./../../config/log')(module);

module.exports = (app) => {
    app.use('/api/auth/admins', router);
};

// Создать админа
router.post('/create', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить всех администраторов
router.get('/', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Получить информацию админа по id
router.get('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Обновление информации админа по id
router.put('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});

// Удалить админа
router.delete('/:id', function(req, res, next) {
    log.info(`START - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(200).send({ message: 'It\'s stub!' });
});