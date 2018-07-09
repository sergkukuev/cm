const desc = {
    szMarks: "Количество оценок должно быть равным 4",
    pageCountNegative: "Параметры \'page\' и \'count\' не должны иметь отрицательное значение",
    incorrectID: "Некорректный идентификатор",
    noData: "Отсутствуют данные для обновления",
    opDel: "Операция удаления успешно завершена"
};

module.exports = {
    szMarks     : desc.szMarks,
    pcNegative  : desc.pageCountNegative,
    incorrectID : desc.incorrectID,
    noData      : desc.noData,
    opDel       : desc.opDel,

    NoKey : function(key) {
        return "Отсутствует ключ \'" + key + "\'";
    },
    NoFoundObj : function(id) {
        return "Объект с идентификатором (" + id + ") не найден";
    },
    ObjDeleted : function(id) {
        return "Объект с идентификатором(" + id + ") удален";
    },
    ObjArray : function(name) {
        return "Параметр " + name + " должен быть массивом";
    },
    SzEqual : function() {
        let res = "Размер следующих массивов должен быть одинаковый (";
        for (let i = 0; i < arguments.length; i++) {
            let dot = (arguments.length - 1 == i) ? "\')" : "\',";
            res = res + "\'" + arguments[i] + dot;
        }
        return res;
    },
    SzKnowledge : function() {
        let res = "Количество требуемых знаний не совпадает. Проверьте следующие параметры (";
        for (let i = 0; i < arguments.length; i++) {
            let dot = (arguments.length - 1 == i) ? "\')" : "\',";
            res = res + "\'" + arguments[i] + dot;
        }
        res[res.length - 2] = ")";
        return res;
    },
    incorrectData : function(name) {
        return "Данные параметра \'" + name +"\' являются некорректными или отсутствуют";
    }
}