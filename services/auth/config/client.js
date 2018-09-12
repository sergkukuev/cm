const   client  = require('./../app/models/client').clientModel, 
        log     = require('./log')(module);

// Удаление клиент-агрегатора
client.remove(function(err) {
    if (err) {
        log.error(`${err.status || 500} - ${err.message}`);
        log.debug(err.stack);
        return;
    }
    // Пересоздание
    let aggregator = new client({
        name        : 'aggr_cm',
        appId       : 'aggr_id',
        appSecret   : 'aggr_secret'
    });
    aggregator.save(function(err, res) {
        if (err) {
            log.error(`${err.status || 500} - ${err.message}`);
            log.debug(err.stack);
            return;
        }
        log.info('SUCCESS - Created client-aggregator', res.name);
        return;
    });
});