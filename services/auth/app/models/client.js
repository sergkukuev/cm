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

// Получение клиента по appId и appSecret
Client.statics.GetByData = function(id, secret, callback) {
    let data = {
        appId: id,
        appSecret: secret
    };
    return this.findOne(data, function(err, app) {
        if (err) {
            return callback(err, null);
        } else if (!app) {
            return callback(new Error('Client not found'), null);
        }
        return callback(null, app);
    });
}

// Получение клиента по id
Client.statics.GetById = function(id, callback) {
    this.findById(id, function(err, app) {
        if (err) {
            return callback(err, null);
        } else if (!app) {
            return callback(new Error('Client not found'), null);
        }
        return callback(null, app);
    });
}

// Удаление всех клиентов из базы
Client.statics.Clear = function(callback) {
    return this.remove({}, function(err, result) {
        if (err) {
            return callback(err, null);
        } else if (!result) {
            return callback(new Error('Delete falied'), null);
        }
        return callback(null, result);
    });
}

mongoose.model('Client', Client);

const log = require('./../../config/log')(module);
var ClientModel = mongoose.model('Client');
module.exports.model = ClientModel;

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