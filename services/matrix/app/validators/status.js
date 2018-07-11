// Модуль содержит описание распространенных ошибок сервиса
const msg = {
    PageCountNeg: "Параметры \'page\' и \'count\' не должны иметь отрицательное значение",
    //InvalidId   : "Идентификатор имеет некорректный формат",
    NoData      : "Отсутствуют данные для обновления",
    LossOfData  : "Во время запроса данные были потеряны", 
    OperSuccess : "Операция прошла успешно"
};

module.exports = {
    PCNegative  : msg.PageCountNeg,
    //InvalidId   : msg.InvalidId,
    NoData      : msg.NoData,
    LossData    : msg.LossOfData,
    Success     : msg.OperSuccess,

    NoKey : function(key) {
        return "Отсутствует параметр \'" + key + "\'";
    },
    NotFound : function(id) {
        return "Объект с идентификатором \'" + id + "\' не найден";
    },
    Deleted : function(amount) {
        return "Удалено " + amount + " элементов";
    },
    ObjDeleted : function(id) {
        return "Объект с идентификатором \'" + id + "\' удален";
    },
    ObjArray : function(name) {
        return "Параметр \'" + name + "\' должен быть массивом";
    },
    InvalidId : function(id) {
        return "Идентификатор \'" + id + "\' имеет некорректный формат"
    },
    IncorrectData : function(key) {
        return "Данные параметра \'" + key +"\' являются неправильными или отсутствуют";
    },
    SzNotEqual : function() {
        // в arguments кидаются строки (названия массивов) 
        let res = "Размер следующих массивов должен быть одинаковый (";
        for (let i = 0; i < arguments.length; i++) {
            let dot = (arguments.length - 1 == i) ? "\')" : "\',";
            res = res + "\'" + arguments[i] + dot;
        }
        return res;
    }
}