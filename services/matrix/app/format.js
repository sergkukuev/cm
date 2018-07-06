// Шаблоны для преобразования JSON перед отправкой результата запроса
module.exports = {
    // Шаблон для отправки данных
    // (для универсальности, в случае добавления новых полей, к примеру токенов для межсервисной авторизации)
    Data : function(data) {
    let item = {

    };
    return data;
    },
    // Шаблон для отправки статуса
    Status : function(st, desc) {
        let item = {
            status: st,
            description: desc
        };
        return item;
    }
}