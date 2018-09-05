// Маршруты для обращения к сервису авторизации
var express = require('express'),
    router  = express.Router(),
    crd     = require('./../coordinators'),
    format  = require('./../validators/format');

module.exports = function(app) { 
    app.use('/api', router);
}

// Авторизация логин/пароль
router.post('/auth', function(req, res, next) {
    const data = {
        login: req.body.login,
        password: req.body.password
    };
    return crd.GetTokenByPass(data, function(err, status, response) {
        if (err) 
            return res.status(status).send(response);
        else
            return res.status(200).send(response);
    });
});

// OAUTH2 авторизация (через внешний ресурс)
// Данные агрегатора
const app = {
    id: require('./../../config').app.id,
    secret: require('./../../config').app.secret
};

// Переадресация на сторонний ресурс
router.get('/oauth2', function(req, res, next) {
    const authUrl = 'http://localhost:3005/auth/authorization?';
    const redUrl = 'http://localhost:3000/api/code';
    const params = ['response_type=code', 'app_id=' + app.id, 'redirect_uri=' + redUrl];
    const uri = authUrl + params.join('&');
    return res.status(302).redirect(uri);
});

// Получение токена авторизации
router.post('/auth', function(req, res, next) {
    let auth = req.headers.authorization;
    if (!auth)
        return res.status(401).send(format.T(401, 'No token'));

    const data = {
        refresh_token: auth.split(' ')[1]
    };
    return crd.GetTokenByToken(data, function(err, status, response) {
        if (err)
            return res.status(status).send(response);
        else {
            const scope = {
                status: status,
                response: response,
                entryData: data
            };
            return res.status(200).send(scope);
        }
    });
});

// Получение кода для авторизации
router.get('/code', function(req, res, next) {
    const code = req.query.code;
    if (!code || typeof(code) == 'undefined' || code.length == 0)
        return res.status(500).send(format.T(500, 'Authorization service didn\'t send code'));
    const scope = {
        code: code
    };
    crd.GetTokenByCode(scope, function(err, status, response) {
        if (err)
            return res.status(status).send(response);
        else {
            let result = JSON.parse(response);
            result.status = status;
            return res.status(200).send(result);
        }
    });
})

// Проверка авторизации пользователя перед выполнением операции
function CheckAuth(req, res, callback) {
    // Формируем и проверяем данные 
    let auth = req.headers.authorization;
    if (!auth)
        return res.status(401).send(format.T(401, 'No token'));
    const data = {
        token: auth.split(' ')[1]
    };
    if (!data.token || data.token.length == 0 || typeof(data.token) === 'undefined')
        return res.status(401).send(format.T(401, 'Invalid token'));

    // Запрос на проверку авторизации пользователя
    return crd.GetUserInfo(data, function(err, status, response) {
        if (err)
            return res.status(status).send(err);
        if (status !== 200) // Пользователь не прошел авторизацию
            return res.status(status).send(response);
        return callback(response);  //Успешно пройденная авторизация
    });
}

module.exports.default = CheckAuth;   // Экспортируем проверку авторизации, чтобы другие маршруты могли ее брать