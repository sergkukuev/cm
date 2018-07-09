// Шаблоны для преобразования JSON перед отправкой результата запроса
module.exports = {
    // Шаблон для отправки данных
    // (для универсальности, в случае добавления новых полей, к примеру токенов для межсервисной авторизации)
    Data : function(data) {
        return data;
    },
    // Шаблон для отправки статуса
    Status : function(st, cd, desc) {
        let item = {
            status: st,
            code: cd,
            description: desc
        };
        return item;
    },
    // Клиентская ошибка
    BadRequest : function(desc) {
        let item = {
            status: "Error",
            code: 400,
            description: desc
        };
        return item;
    },
    // Ресурс не найден
    NotFound : function(desc) {
        let item = {
            status: "Error",
            code: 404,
            description: desc
        };
        return item;
    }
}