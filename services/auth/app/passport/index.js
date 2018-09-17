const   basic       = require('basic-auth'),
        strategy    = require('./strategy'),
        cs          = require('./../../config').security,
        log         = require('./../../config/log')(module);

const basicType  = /basic/i;
const bearerType = /bearer/i;

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
    },
    // Проверка авторизации пользователя
    CheckUserByBearer : function(header_text , callback) {
        log.info('Checker user authorization by bearer token');
        if (!bearerType.test(header_text))
            return callback(new Error('Isn\'t Bearer token'), 400, null);
        const token = getBearer(header_text);
        return strategy.СheckUserByAToken(token, function(err, status, user) {
            if (err)
                return callback(err, status);
            if (status || !user)
                return callback(new Error('User not found'), status);
            return callback(null, status, user);
        });
    },
    /**
    * @param {Object} data - data
    */
    // Получение кода пользователя для авторизации
    GetUserCode : function (data, callback) {
        log.info('Get user code for auth');
        const validator = checkResType(data.response_type, 'code');
        if (!validator)
            return callback(new Error('Invalid response type'), 400, null);

        return strategy.CheckServiceById(data.appId, function (err, status, response) {
            if (err)
                return callback(err, status, response);
            else if (!response)
                return callback(err, status, null);
            return strategy.GetUserCode(data.login, data.password, function(err, status, code){
                return callback(err, status, code);
            });
        });
    },
    // Пересоздание токенов пользователя по коду
    SetUTokenByCode : function(code, callback) {
        log.info('Set user tokens by code');
        return strategy.UTokenByCode(code, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    // Пересоздание токенов пользователя по паролю
    SetUTokenByPass : function(data, callback) {
        log.info('Set user tokens by password');
        return strategy.UTokenByPass(data, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
    },
    // Пересоздание токенов пользователя по токену
    SetUTokenByToken : function(token, callback) {
        log.info('Set user tokens by token');
        return strategy.UTokenByToken(token, function(err, status, scope) {
            if (err)
                return callback(err, status, null);
            if (!scope)
                return callback(null, status, null);
            return callback(null, null, scope);
        });
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
        if (err)
            return callback(err, status, null);
        if (!result)
            return callback(new Error('Invalid token'), 400, null);
        let response = {
            token: serviceToken,
            expires_in : cs.serviceTokenLife
        };
        return callback(null, status, response);
    });
}

// Проверка на совпадение с нужным типом
function checkResType(type, needed) {
    if (type === needed)
        return true;
    return false;
}

// Получить токен
function getBearer(token) {
    token = String(token);
    token = token.slice(7);
    return token;
}