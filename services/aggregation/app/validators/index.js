// Модуль валидации 
module.exports = {
    // Проверка сервисного токена
    ServiceToken : function(code, res, method, token, info, callback) {
        let result = false;
        if (code == 401 && res.statusText == 'Unauthorized') {
            // Авторизация не удалась, токен не местный
            delete token;
            token = null;
            method(info, callback); // Вызов метода после очистки токена
        } else if (typeof(res.service) != 'undefined') {
            // Установка нового токена
            token = res.service;
            delete res.service;
            result = true;
        }
        return result;
    }
}