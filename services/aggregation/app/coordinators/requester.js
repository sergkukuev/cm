// Модуль обработки запросов
const   config  = require('./../../config'),
        req     = require('request'),
        format  = require('./../validators/format'),
        log     = require('./../../config/log')(module);

module.exports = {
    // Установка опций перед запросом
    Options : function(uri, method, token, user_token = null, user_id = null) {
        log.info('START - Set request options');
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
        req.head(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        });
    }, 
    HttpGet : function(opt, callback) {
        req.get(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        });
    },
    HttpPost : function(opt, data, callback) {
        req.post(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        }).form(data);
    }, 
    HttpPut : function(opt, data, callback) {
        req.put(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        }).form(data);
    },
    HttpDelete : function(opt, callback) {
        req.delete(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        });
    },
    // Выдача ответа
    Response : function(err, status, response, callback) {
        log.info('START - Creating response');
        if (err) {
            // Проверка на недоступность сервера
            if (err.code == "ECONNREFUSED") {
                const msg = 'Сервис недоступен, повторите попытку позже';
                return callback(err, 503, format.T(503, msg));
            }
        }
        if (status >= 400 && status <= 600) {
            return callback(response, status, JSON.parse(response));
        }
        return response ? callback(err, status, format.Data(JSON.parse(response))) : 
            callback(err, status, null);
    }
}