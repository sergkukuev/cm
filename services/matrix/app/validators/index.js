module.exports = {
    // Проверка номера страницы и количество данных на странице
    parsePageOrCount : function(string) {
        if (string) {
            let res = Number(parseInt(string));
            if (isNaN(res))
                return 0;   // Дефолтное значение
            return res;
        }
        return 0;
    },
    // Проверка корректности ID объекта
    checkId : function(id) {
        let mongoose = require('mongoose');
        return mongoose.Types.ObjectId.isValid(id);
    }, 
    // Проверка строки на пустоту
    checkEmptyStr : function(str) {
        if (str.trim() == '')
            return true;
        else    
            return false;
    },
    // Проверка строки на 'undefined'
    checkUndefined : function(str) {
        if (str == undefined)
            return true;
        else
            return false;
    },
    // Проверка массива marks (если marks = undefined, то просто скипаем, данная ошибка обрабатывается при попытке добавления в базу)
    checkMarks : function(marks) {
        if (marks.length == 4 && (marks instanceof Array))
            return true;
        else
            return false;
    }
}