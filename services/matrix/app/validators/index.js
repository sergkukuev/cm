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
    // Проверка челочисленного значения
    checkInt : function(string) {
        if (string) {
            let res = Number(parseInt(string));
            if (isNaN(res))
                return undefined;
            return res;
        }
        return undefined;
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
    },
    // Проверка знаний в задаче на повторения
    checkKnRepeat : function(id, kns) { // Идентификатор и массив, где проверяется 
        let flag = false;
        for (let i = 0; i < kns.length; i++) {
            if (id == kns[i])
                flag++;
        }
        return flag - 1;
    }
}