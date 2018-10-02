const mongoose  = require('mongoose'),
      life      = require('../../config').security.STLife,
      Schema    = mongoose.Schema;

// Модель токена доступа
var Token = new Schema({
    userId: {
        type: String,
        required: true
    },
    value: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Создание токена доступа
Token.statics.Create = function(token, callback) {
    token = new Token(token);  // Создаем модель токена из данных
    token.save(function(err, token) {
        if (err)
            callback(err, null);
        else
            token ? callback(null, token) : callback(new Error('Token not saved'), null);
        return;
    });
}

// Получить все токены
Token.statics.Get = function(callback) {
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

// Получить токены доступа по id пользователя
Token.statics.GetByUserId = function(id, callback) {
    return this.find({ userId: id }, function(err, tokens) {
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

// Поиск токена по значению
Token.statics.GetByValue = function(value, callback) {
    return this.findOne({ value: value }, function (err, token) {
        if (err) {
            return callback(err, null);
        } else if (!token) {
            let err = new Error('Token with this value not found');
            err.name = 'TokenError';
            return callback(err, null);
        }
        return callback(null, token);
    });
}

// Удаление всех клиентов из базы
Token.statics.Clear = function(callback) {
    this.remove({}, function(err, result) {
        if (err) 
            return callback(err, null);
        else
            result ? callback(null, result) : callback(new Error('Deleting failed'), null);
    });
}

// Формат для выдачи сервису
Token.statics.Format = function(token) {
    return {
        token: token.value,
        expires_in: life
    };
}

mongoose.model('AccessToken', Token);
mongoose.model('RefreshToken', Token);
mongoose.model('UserAccessToken', Token);

var ServiceModel = mongoose.model('AccessToken'),
    UserModel    = mongoose.model('UserAccessToken'),
    RefreshToken = mongoose.model('RefreshToken');

module.exports.model_s = ServiceModel;
module.exports.model_u = UserModel;
module.exports.model_r = RefreshToken;