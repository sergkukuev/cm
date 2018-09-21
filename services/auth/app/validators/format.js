// Формирование ошибки
module.exports.TError = function(name, message, status = 400, service = null) {
    let err = new Error(message);
    if (name)       err.name = name;
    if (service)    err.service = service;
    err.status = status;
    return err;
}

// Добавление параметра в ошибку
module.exports.AError = function(err, name = null, message = null, status = null, service = null) {
    if (name)       err.name = name;
    if (message)    err.message = message;
    if (status)     err.status = status;
    if (service)    err.service = service;
    return err;
}

// Формирование ответа
module.exports.TData = function(content, service = null) {
    let data = { content: content };
    if (service)    data.service = service;
    return data;
}