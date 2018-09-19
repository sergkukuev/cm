const 	log         = require('./../../config/log')(module),
        basic   	= require('basic-auth'),
        strategy 	= require('./strategy'),
        life        = require('./../../config').security.USLife,
      	basicType 	= /basic/i,
      	bearerType 	= /bearer/i;

module.exports = {
	// Проверка сервисной авторизации
    CheckServiceAuth : function(header_authorization, callback) {
        log.info('Checker service authorization');
        const type = basicType.test(header_authorization);
        if (type)
            return checkBasicAuth(header_authorization, callback);
        else if (bearerType.test(header_authorization))
            return checkBearerAuth(header_authorization, callback);
        return callback(new Error('Unknown authorization type'), 400, null);
    }
}

// Проверка авторизации по appId и appSecret
function checkBasicAuth(header_authorization, callback) {
    const service = basic.parse(header_authorization);
    return strategy.CheckService(service.name, service.pass, function(err, status, application) {
        if (err)
            return callback(err, status, null);
        if (!application)
            return callback(null, status, null);
        return strategy.SetNewAToken(application, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    });
}

// Проверка авторизации по токену
function checkBearerAuth(header_authorization, callback) {
    const serviceToken = getBearer(header_authorization);
    return strategy.CheckServiceAToken(serviceToken, function(err, status, result) {
        let response = {
            token: serviceToken,
            expires_in : life
        };
        if (err)
            return callback(err, status, response);
        if (!result)
            return callback(new Error('Invalid token'), 400, response);
        return callback(null, status, response);
    });
}

// Получить токен
function getBearer(token) {
    token = String(token);
    token = token.slice(7);
    return token;
}