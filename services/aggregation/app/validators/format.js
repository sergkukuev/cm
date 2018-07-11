// Шаблоны для преобразования JSON перед отправкой результата запроса
module.exports = {
    // Преобразования ответа с проверкой на недоступность сервиса
    Data : function(err, res) {
        let result;
        err ? (err.code == "ECONNREFUSED" ? result = res : result = err) : 
            (res ? result = res : result = { status: "Error", description: "Ресурс не найден"});
        return result;
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