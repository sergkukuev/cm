const mongoose    = require('mongoose'),
      Schema      = mongoose.Schema;

// Модель токена обновления
var RToken = new Schema({
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
});

// Получить все токены обновления
RToken.statics.get = function(callback) {
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

mongoose.model('RefreshToken', RToken);

var TokenModel = mongoose.model('RefreshToken');
module.exports.model = TokenModel;