module.exports = {
    // Валидация типа запроса
    ResponseType : function(type) {
        type = this.Validity(type);
        if (type != "code" && type != "refresh_token" && type != 'password')
            type = null;
        return type;
    },
    // Валидация параметра
    Validity : function(text) {
        if (!text || typeof(text) == "undefined" || text.length == 0)
            text = null;
        return text;
    },
    // Валидация ID объекта
    ValidityId : function(id) {
        let mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(id))
            id = null;
        return id;
    }
}