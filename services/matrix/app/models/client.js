const   mongoose    = require('mongoose'),
        log         = require('./../../config/log')(module);

const Schema  = mongoose.Schema;

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

mongoose.model('Client', Client);
var client = mongoose.model('Client');

// Проверка клиента-агрегатора в базе
module.exports.VerifyClient = function(name, appId, appSecret, created) {
    client.findOne({name : name}, function(err, app) {
        if (err) {
            log.error(`${err.status || 500} - ${err.message}`);
            log.debug(err.stack);
        }
        // Создать клиент
        if (!app && created) {
            let aggregator = new client({
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

module.exports.model = client;