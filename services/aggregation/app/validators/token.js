// Проверка сервисной авторизации
const log = require('./../../config/log')(module);

module.exports = function (code, response, data, method, token, callback) {
    if (code == 401 && response.status == 'ServiceTokenError') {
        // Авторизация не удалась, освежаем токен и пробуем еще раз
        log.warn('Service token is invalid or expire. Attempt to update it');
        delete token;
        token = null;
        method(data, callback);
    } else if (response != null) {  // Проверка пустого ответа
        if (typeof(response.service) != 'undefined') {
            // Установка нового токена
            token = response.service;
            delete response.service;
        }
    }
    return token;
}