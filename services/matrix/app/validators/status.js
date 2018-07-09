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
    }
}