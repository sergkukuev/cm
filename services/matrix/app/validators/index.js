module.exports = {
    // Проверка валидности параметра
    Validity : function(text) {
        if (!text || typeof(text) == "undefined" || text.length == 0)
            text = null;
        return text;
    },
    // Преобразование int
    CastInt : function(value, def = undefined) {
        if (value) {
            let numeric = Number(parseInt(value));
            if (isNaN(numeric))
                return def; // Значение по умолчанию
            return numeric;
        }
        return def;
    },
    // Проверка строки на 'undefined'
    IsUndefined : function(value) {
        let result;
        value == undefined ? result = true : result = false;
        return result;
    },
    // Проверка строки на пустоту
    IsEmptyStr : function(string) {
        let result;
        string.trim() == '' ? result = true : result = false;
        return result;
    },
    // Проверка корректности ID объекта
    VerifyId : function(id) {
        let mongoose = require('mongoose');
        return mongoose.Types.ObjectId.isValid(id);
    },
    // Проверка повторения элемента в массиве
    RepeatOfArray : function(elem, array) { 
        let flag = false;
        for (let i = 0; i < array.length; i++) {
            if (elem == array[i])
                flag++;
        }
        return flag - 1;
    }
}