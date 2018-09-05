// Модуль обработки запросов
const config = require('./../../config');
const req  = require('request');
const format = require('./../validators/format')

module.exports = {
    // Установка опций перед запросом
    Options : function(uri, method, token, user_token = null, user_id = null) {
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
    // Формирование запросов
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
    // Запрос
    Response : function(err, status, response, callback) {
        if (err) {
            if (err.code == "ECONNREFUSED") {
                const msg = 'Сервис недоступен, повторите попытку позже';
                return callback(err, 503, format.T(503, msg));
            }
            return callback(err, status, JSON.parse(response));
        }
        else {
            response ? callback(err, status, JSON.parse(response)) : callback(err, status, null);
        }
    }
}