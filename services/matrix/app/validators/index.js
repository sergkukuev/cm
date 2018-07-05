module.exports = {
    // Проверка номера страницы и количество данных на странице
    parsePageOrCount : function(string) {
        if (string) {
            let res = Number(parseInt(string));
            if (isNaN(res) || res < 0)
                return 0;   // Дефолтное значение
            return res;
        }
        return 0;
    },
    // Проверка корректности ID объекта
    checkId : function(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }, 
    // Проверка строки на пустоту
    checkEmptyStr : function(string) {
        if (string.trim() == '')
            return true;
        else    
            return false;
    }
}