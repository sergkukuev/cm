// Шаблоны для преобразования JSON перед отправкой результата запроса
module.exports = {
    // Шаблон для отправки данных
    // (для универсальности, в случае добавления новых полей, к примеру токенов для межсервисной авторизации)
    Data : function(data) {
        return data;
    },
    // Шаблон для отправки статуса
    Status : function(st, desc) {
        let item = {
            status: st,
            description: desc
        };
        return item;
    },
    // Клиентская ошибка
    BadRequest : function(desc) {
        let item = {
            status: 400,
            statusText: "Bad Request",
            description: {
                name: "MyBadRequestError",
                message: desc,
                status: "Error"
            }
        };
        return item;
    },
    // Ресурс не найден
    NotFound : function(desc) {
        let item = {
            status: 404,
            statusText: "Not Found",
            description: {
                name: "MyNotFoundError",
                message: desc,
                status: "Error"
            }
        };
        return item;
    }
}