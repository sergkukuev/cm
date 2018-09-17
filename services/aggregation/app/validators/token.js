// Проверка сервисной авторизации
module.exports = function (code, response, data, method, token, callback) {
    // Авторизация не удалась, токен не местный
    if (code == 401 && response.statusText == 'Unauthorized') {
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