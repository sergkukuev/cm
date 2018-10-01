module.exports = {
    // Проверка типа запроса
    ResponseType : function(type) {
        type = this.Validity(type);
        if (type != "code" && type != "refresh_token" && type != 'password')
            type = null;
        return type;
    },
    // Проверка валидности параметра
    Validity : function(text) {
        if (!text || typeof(text) == "undefined" || text.length == 0)
            text = null;
        return text;
    }
}