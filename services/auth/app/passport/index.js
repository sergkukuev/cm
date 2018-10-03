const   basic       = require('basic-auth'),
        strategy    = require('./strategy'),
        validator   = require('./../validators');

const   userGroup   = require('./../models/user').groups,
        TError      = require('./../validators/format').TError;

const   basicType  = /basic/i,
        bearerType = /bearer/i;

module.exports = {
    // Методы авторизации
    ServiceAuth,    // Сервисная авторизация
    UserAuth,       // Пользовательская авторизация
    AdminAuth,      // Авторизация администратора
    SAAuth,         // Двойная авторизация (админ + сервис)
    SUAuth,         // Двойная авторизация (пользователь + сервис)

    // Получить код пользователя
    GetUserCode,

    // Обновление токенов пользователя
    SetUTokenByCode,
    SetUTokenByPass,
    SetUTokenByToken
}

// Проверка сервисной авторизации
function ServiceAuth(headers, callback) {
    let header_auth = validator.Validity(headers['authorization']);
    if (!header_auth)
        return callback(TError(null, true, 'Invalid header "authorization"', 400), null);

    choiceSAuth(header_auth, function(err, status, scope) {
        return formatCallback(err, status, scope, 'Scope of service-authorization is null', callback);
    });
}

// Проверка авторизации пользователя по токену
function UserAuth(headers, callback) {
    let header_auth = validator.Validity(headers['user-authorization']);
    if (!header_auth || !bearerType.test(header_auth))
        return callback(TError(null, true, 'Invalid header "user-authorization"', 400), null);
    
    const token = String(header_auth);
    token = token.slice(7);
    return strategy.CheckUser(token, function(err, status, user) {
        return formatCallback(err, status, user, 'Scope of user-authorization is null', callback);
    });
}

// Проверка авторизации администратора по токену
function AdminAuth(headers, callback) {
    UserAuth(headers, function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (user.group != userGroup[1]) {
            return callback(TError(null, true, 'Access denied', 403), null);
        }
        return callback(null, user);
    });
}

// сервис + админ
function SAAuth(headers, callback) {
    ServiceAuth(headers, function(err, service_scope) {
        if (err) {
            return callback(err);
        }
        AdminAuth(headers, function(err, user_scope) {
            err ? callback(err, service_scope, null) : callback(null, service_scope, user_scope);
        });
    });
}

// сервис + пользователь
function SUAuth(headers, callback) {
    ServiceAuth(headers, function(err, service_scope) {
        if (err) {
            return callback(err);
        }
        UserAuth(headers, function(err, user_scope) {
            err ? callback(err, service_scope, null) : callback(null, service_scope, user_scope);
        });
    });
}

// Получение кода пользователя для авторизации
function GetUserCode(data, callback) {
    if (data.response_type != 'code') {
        return callback(TError(null, true, 'Invalid parameter "grant_type"', 400), null);
    }
    return strategy.GetUserCode(data, function(err, status, code) {
        return formatCallback(err, status, code, 'User code is null', callback);
    });
}

// Обновление токенов пользователя по коду
function SetUTokenByCode(code, callback) {
    return updateToken(code, strategy.UTokenByCode, callback);
}

// Обновление токенов пользователя по паролю
function SetUTokenByPass(data, callback) {
    return updateToken(data, strategy.UTokenByPass, callback);
}

// Обновление токенов пользователя по токену
function SetUTokenByToken(token, callback) {
    return updateToken(token, strategy.UTokenByToken, callback);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Выбор сервисной авторизации
function choiceSAuth(header_auth, callback) {
    const type = basicType.test(header_auth);
    if (type) {
        return basicAuth(header_auth, callback);
    } else if (bearerType.test(header_auth)) {
        return bearerAuth(header_auth, callback);
    }
    return callback(new Error('Unknown authorization type'), 400, null);
}

// Проверка авторизации по appId и appSecret
function basicAuth(header_auth, callback) {
    const service = basic.parse(header_auth);
    strategy.CheckService(service, function(err, status, app) {
        if (err) {
            return callback(err, status, null);
        }
        strategy.SetNewToken(app, function(err, status, scope) {
            return formatCallback(err, status, scope, 'Service data is null', callback);
        });
    });
}

// Проверка авторизации по токену
function bearerAuth(header_auth, callback) {
    const service = String(header_auth);
    service = service.slice(7);
    strategy.CheckServiceByToken(service, function(err, status, token) {
        return formatCallback(err, status, token, 'Token is null', callback);
    });
}

// Обновление пользовательских токенов
function updateToken(data, method, callback) {
    return method(data, function(err, status, scope) {
        return formatCallback(err, status, scope, 'Scope of tokens is null', callback);
    });
}

// Формирование коллбэка
function formatCallback(err, status, scope, message, callback) {
    if (err || !scope) {
        err ? callback(err, status, null) :
            callback(TError(null, true, 400, message), 400, null);
        return;
    }
    return callback(null, status, scope);
}