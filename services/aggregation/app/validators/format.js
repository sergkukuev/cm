// Шаблоны для преобразования JSON перед отправкой результата запроса
module.exports = {
    Data : function(err, res) {
        let result;
        err ? (err.code == "ECONNREFUSED" ? result = res : result = err) : 
            (res ? result = res : result = { status: "Error", description: "Ресурс не найден"});
        return result;
    }
}