// Формирование ошибки
module.exports.TError = function(err = null, flagmsg = true) {
    // Подсчитываем количество типов переменных (максимум 2 - string, 1 - object, 1 - number)
    // Если хотя быть одного типа больше положенного, то выкидываем новый err
    let flagerror = false;
    let nstr = 0, nnum = 0, nobj = 0;
    for (let i = 2; i < arguments.length && !flagerror; i++) {
        if (typeof(arguments[i]) == 'string') {
            nstr++;
        } else if (typeof(arguments[i]) == 'object') {
            nnum++;
        } else if (typeof(arguments[i]) == 'number') {
            nobj++;
        }
        if ((flagmsg && nstr > 2) || (!flagmsg && nstr > 1) || nnum > 1 || nobj > 1) {
            flagerror = true;
        }
    }
    // Найдено больше элементов, чем мы себе можем позволить
    if (flagerror)
        return new Error('Wrong error generation');

    // Создаем, если ошибка не создана
    if (!err)
        err = new Error('Empty error');
    // Подставляем параметры
    for (let i = 2; i < arguments.length; i++) {
        if (typeof(arguments[i]) == 'string') {
            flagmsg ? err.message = arguments[i] : err.name = arguments[i];
            flagmsg = false;
        } else if (typeof(arguments[i]) == 'object') {
            err.service = arguments[i];
        } else if (typeof(arguments[i]) == 'number') {
            err.status = arguments[i];
        }
    }
    return err;
}

// Формирование ответа
module.exports.TData = function(content, service = null) {
    let data = { content: content };
    if (service)    data.service = service;
    return data;
}