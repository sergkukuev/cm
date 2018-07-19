// Модуль обработки запросов
const req  = require('request');
const format = require('./../validators/format')
module.exports = {
    Options : function(uri, method) {
        let item = {
            method: method, 
            uri: uri
        };
        return item;
    },
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
    Response : function(err, status, response, callback) {
        if (err) {
            if (err.code == "ECONNREFUSED") 
                return callback(err, 503, format.ServerNotAviable());
            return callback(err, status, JSON.parse(response));
        }
        else {
            response ? callback(err, status, JSON.parse(response)) : callback(err, status, null);
        }
    }
}