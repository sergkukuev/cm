module.exports = {
    // Шаблон с данными
    // (для универсальности, в случае добавления новых полей, к примеру токенов для межсервисной авторизации)
    Data : function(data, scope) {
        let result = {
            content: data,
            service: scope
        };
        return result;
    },
    // Шаблон без данных
    T : function(code, desc) {
        let stText = findStatusByCode(code);
        let typeText = getTypeByCode(code);
        
        let item = {
            status: code,
            statusText: stText,
            description: { 
                name: "ServiceAnswer",
                message: desc,
                status: typeText
            }
        };
        return item;
    }
}

// Получение категорию статуса по коду состояния 
function getTypeByCode(code) {
    let result = '';
    if (code >= 100 && code < 200)
        result = 'Information';
    else if (code >= 200 && code < 300)
        result = 'Success';
    else if (code >= 300 && code < 400)
        result = 'Redirect';
    else if (code >= 400 && code < 600)
        result = 'Error';
    else
        result = 'Unknown';
    return result;
}

// Поиск дескриптора по коду состояния
function findStatusByCode(code) {
    let bFind = false;
    let index = 0;
    for (; index < HTTP_state.length && !bFind; index++)
        if (HTTP_state[index].code == code)
            bFind = true;

    let result;
    index == HTTP_state.length ? result = 'Unknown Error' : result = HTTP_state[index - 1].text;
    return result; 
}

// Основные коды состояний HTPP
const HTTP_state = [
    // 1xx: Information
    { code: 100, text: 'Continue' },
    { code: 101, text: 'Switching Protocols' },
    { code: 102, text: 'Processing' },

    // 2xx: Success
    { code: 200, text: 'OK' },
    { code: 201, text: 'Created' },
    { code: 202, text: 'Accepted' },
    { code: 203, text: 'Non-Authoritative Information' },
    { code: 204, text: 'No Content' },
    { code: 205, text: 'Reset Content' },
    { code: 206, text: 'Partial Content' },
    { code: 207, text: 'Multi-Status' },
    { code: 208, text: 'Already Reported' },
    { code: 226, text: 'IM Used' },

    // 3xx: Redirect
    { code: 300, text: 'Multiple Choices' },
    { code: 301, text: 'Moved Permanently' },
    { code: 302, text: 'Found' },
    { code: 303, text: 'See Other' },
    { code: 304, text: 'Not Modified' },
    { code: 305, text: 'Use proxy' },
    { code: 307, text: 'Temporary Redirect' },

    // 4xx: Client Error
    { code: 400, text: 'Bad Request' },
    { code: 401, text: 'Unauthorized' },
    { code: 402, text: 'Payment Required' },
    { code: 403, text: 'Forbidden' },
    { code: 404, text: 'Not Found' },
    { code: 405, text: 'Method Not Allowed' },
    { code: 406, text: 'Not Acceptable' },
    { code: 407, text: 'Proxy Authentication Required' },
    { code: 408, text: 'Request Timeout' },
    { code: 409, text: 'Conflict' },
    { code: 410, text: 'Gone' },
    { code: 414, text: 'Request-URI Too Long' },
    { code: 429, text: 'Too Many Requests' },
    { code: 431, text: 'Request Header Fields Too Large' },

    // 5xx: Server Error
    { code: 500, text: 'Internal Server Error' },
    { code: 501, text: 'Not Implemented' },
    { code: 502, text: 'Bad Gateway' },
    { code: 503, text: 'Service Unavailable' },
    { code: 504, text: 'Gateway Timeout' },
    { code: 505, text: 'HTTP Version Not Supported' }
];
