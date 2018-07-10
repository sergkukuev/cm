// Модуль обработки запросов
module.exports = {
    Options : function(uri, method) {
        let item = {
            method: method, 
            uri: uri
        };
        return item;
    },
    HttpHead : function(opt, callback) {
        const req = require('request');
        req.head(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        });
    }, 
    HttpGet : function(opt, callback) {
        const req = require('request');
        req.get(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        });
    },
    HttpPost : function(opt, data, callback) {
        const req = require('request');
        req.post(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        }).form(data);
    }, 
    HttpPut : function(opt, data, callback) {
        const req = require('request');
        req.put(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        }).form(data);
    },
    HttpDelete : function(opt, callback) {
        const req = require('request');
        req.delete(opt.uri, opt, function(err, res, body) {
            err ? callback(err, null, null) : callback(null, res.statusCode, body);
        });
    },
    Response : function(err, status, response, callback) {
        if (err) {
            if (err.code == "ECONNREFUSED") 
                return callback(err, 503, { status: "Error", code: 503, description: "Сервер недоступен, повторите попытку позже" });
            return callback(err, status, response);
        }
        else {
            response ? callback(err, status, response) : callback(err, status, null);
        }
    }
}