// Модуль сервисного токена с функцией проверки
module.exports = {
    value : null,   // Значение токена
    // Проверка токена 
    Check : function(code, res, method, data, callback) {
        let result = false;
        this.value ? result = true : result = false;
        if (code == 401 && res.statusText == 'Unauthorized') {
            // Авторизация не удалась, токен не местный
            delete this.value;
            this.value = null;
            method(data, callback); // Вызов метода после очистки токена
            result = false;
        } else if (typeof(res.service) != 'undefined') {
            // Установка нового токена
            this.value = res.service;
            delete res.service;
            result = true;
        }
        return result; 
    }
}