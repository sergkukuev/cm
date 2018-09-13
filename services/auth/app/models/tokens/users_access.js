const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

// Модель пользовательского токена доступа
var UAToken = new Schema({
    userID: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastUse : {
        type: Date,
        default : Date.now
    }
});

// Получить все пользовательские токены доступа по его идентификатору
UAToken.statics.getByUserId = function(id, callback) {
    return this.find({userID: id}, function(err, tokens) {
        if (err)
            return callback(err, null);
        if (tokens) {
            let result = [];
            for (let i = 0; i < tokens.length; i++)
                result[i] = tokens[i];
            return callback(null, result);
        }
        return callback(null, null);
    });
}

// Получить все пользовательские токены доступа
UAToken.statics.get = function(callback) {
    return this.find(function(err, tokens) {
        if (err)
            return callback(err, null);
        if (tokens) {
            let result = [];
            for (let i = 0; i < tokens.length; i++)
                result[i] = tokens[i];
            return callback(null, result);
        }
        return callback(null, null);
    });
}

mongoose.model('UserAccessToken', UAToken);

var TokenModel = mongoose.model('UserAccessToken');
module.exports.model = TokenModel;