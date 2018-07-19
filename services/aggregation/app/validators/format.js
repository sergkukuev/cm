// Шаблоны для преобразования JSON перед отправкой результата запроса
module.exports = {
    // Преобразования ответа с проверкой на недоступность сервиса
    Data : function(err, res) {
        let result;
        err ? (err.code == "ECONNREFUSED" ? result = res : result = err) : 
            (res ? result = res : result = this.ResourceNotFound());
        return result;
    },
    // Отсутстувие ресурса
    ResourceNotFound : function() {
    	let item = {
            status: 404,
            statusText: "Not Found",
            description: {
                name: "ResourceNotFoundError",
                message: "Ресурс не найден",
                status: "Error"
            }
        };
    },
    // Сервер недоступен
    ServerNotAviable : function() {
        let item = {
            status: 503,
            statusText: "Server Not Aviable",
            description: {
                name: "ServerNotAviableError",
                message: "Сервер недоступен, повторите попытку позже",
                status: "Error"
            }
        };
        return item;
    },
    // Формирование массива оценок 
    MarkArray : function(what, from) {
        let result = [];
        for (let i = 0; i < from.length; i++) {
            let flag = true;
            for (let j = 0; j < what.length && flag ; j++) {
                if (what[j].id_knowledge == from[i].id) {
                    result.push(what[j].mark);
                    flag = false;
                }
            }
            if (flag) {
                result.push(0);
            }
        }
        return result;
    }
}