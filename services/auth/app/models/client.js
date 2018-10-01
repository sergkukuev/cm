const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

// Модель клиента
const Client = new Schema({
    name: {
        type: String, 
        unique: true,
        required: true
    },
    appId: {
        type: String, 
        required: true
    },
    appSecret: {
        type: String,
        required: true
    }
});

// Получение клиента по appId
Client.statics.GetByApp = function(id, callback) {
    return findByData({ appId: id }, callback);
}

// Получение клиента по appId и appSecret
Client.statics.GetByAppAndSecret = function(id, secret, callback) {
    let data = {
        appId: id,
        appSecret: secret
    };
    return findByData(data, callback);
}

// Получение клиента по id
Client.statics.GetById = function(id, callback) {
    this.findById(id, function(err, app) {
        if (err) {
            return callback(err, null);
        } else if (!app) {
            let err = new Error('Wrong access token');
            err.name = 'ServiceTokenError';
            return callback(err, null);
        }
        return callback(null, app);
    });
}

// Удаление всех клиентов из базы
Client.statics.Clear = function(callback) {
    this.remove({}, function(err, result) {
        if (err) 
            return callback(err, null);
        else
            result ? callback(null, result) : callback(new Error('Deleting failed'), null);
    });
}

mongoose.model('Client', Client);

const log = require('./../../config/log')(module);
var ClientModel = mongoose.model('Client');
module.exports.model = ClientModel;

// Поиск клиента по информации
function findByData(data, callback) {
    ClientModel.findOne(data, function(err, app) {
        if (err) {
            return callback(err, null);
        } else if (!app) {
            let err = new Error('Client with this data not found');
            err.name = 'ServiceTokenError';
            return callback(err, null);
        }
        return callback(null, app);
    });
}

// Проверка клиента-агрегатора в базе
module.exports.VerifyClient = function(name, appId, appSecret, created) {
    let data = {
        name: name,
        appId: appId,
        appSecret: appSecret
    };
    ClientModel.findOne(data, function(err, app) {
        if (err) {
            log.error(`${err.status || 500} - ${err.message}`);
            log.debug(err.stack);
        }
        // Создать клиент
        if (!app && created) {
            let aggregator = new ClientModel({
                name        : name,
                appId       : appId,
                appSecret   : appSecret
            });
            return aggregator.save(function(err, res) {
                if (err) {
                    log.error(`${err.status || 500} - ${err.message}`);
                    log.debug(err.stack);
                    return;
                }
                log.info('Created new client \'' + res.name + '\'');
                return;
            });
        }
        log.info('Client \'' + name + '\' exists');
    });
}