// Модуль обработки запросов
const   config  = require('./../../config'),
        req     = require('request'),
        log     = require('./../../config/log')(module);

module.exports = {
    // Установка опций перед запросом
    Options : function(uri, method, token, user_token = null, user_id = null) {
        log.info('Set request options');
        let item = {
            method: method, 
            uri: uri
        };
        if (token) {
            item.auth = {
                bearer: token.token
            }
        } else {
            item.auth = {
                user: config.app.id,
                pass: config.app.secret
            }
        }
        item.headers = {};
        if (user_token)
            item.headers['user-authorization'] = 'Bearer' + user_token;
        if (user_id)
            item.headers['userId'] = user_id;
        return item;
    },
    // Запросы 
    HttpHead : function(opt, callback) {
        log.info('Head request');
        req.head(opt.uri, opt, function(err, res, body) {
            err ? Response(err, res.statusCode, null, callback) : 
                Response(null, res.statusCode, body, callback);
        });
    }, 
    HttpGet : function(opt, callback) {
        log.info('Get request');
        req.get(opt.uri, opt, function(err, res, body) {
            err ? Response(err, res.statusCode, null, callback) : 
                Response(null, res.statusCode, body, callback);
        });
    },
    HttpPost : function(opt, data, callback) {
        log.info('Post request');
        req.post(opt.uri, opt, function(err, res, body) {
            err ? Response(err, res.statusCode, null, callback) : 
                Response(null, res.statusCode, body, callback);
        }).form(data);
    }, 
    HttpPut : function(opt, data, callback) {
        log.info('Put request');
        req.put(opt.uri, opt, function(err, res, body) {
            err ? Response(err, res.statusCode, null, callback) : 
                Response(null, res.statusCode, body, callback);
        }).form(data);
    },
    HttpDelete : function(opt, callback) {
        log.info('Delete request');
        req.delete(opt.uri, opt, function(err, res, body) {
            err ? Response(err, res.statusCode, null, callback) : 
                Response(null, res.statusCode, body, callback);
        });
    }
}

// Выдача ответа
function Response(err, status, response, callback) {
    log.info('Creating response');
    if (response != null)
        response = JSON.parse(response);    // Ответ почему то приходит в виде строки
    if (err) {
        // Проверка на недоступность сервера
        if (err.code == "ECONNREFUSED") {
            return callback(new Error('Service unavailable, try again later'), 503, response);
        }
        return callback(err, status, response);
    }
    // Если ошибка не пришла в структуру, ловим через код-статус
    if (status >= 400 && status <= 600) {
        return callback(new Error(response.message), status, response);
    }
    return callback(null, status, response);
}