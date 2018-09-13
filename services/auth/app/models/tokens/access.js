const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

// Модель токена доступа
var AToken = new Schema({
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

// Получить токены доступа по идентификатору пользователя
AToken.statics.getByUserId = function(id, callback) {
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

// Получить все имеющиеся токены доступа
AToken.statics.get = function(callback) {
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

mongoose.model('AccessToken', AToken);

var TokenModel = mongoose.model('AccessToken');
module.exports.model = TokenModel;