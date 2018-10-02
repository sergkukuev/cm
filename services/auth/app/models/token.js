const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

// Модель токена
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

// Создание токена
Token.statics.Create = function(token, callback) {
    token = new Token(token);  // Создаем модель токена из данных
    return token.save(function(err, token) {
        if (err) {
            return callback(err, null);
        } else if (!token) {
            return callback(new Error('Token not save'), null);
        }
        return callback(null, token);
    });
}

// Получить все токены
Token.statics.Get = function(callback) {
    return this.find(function(err, tokens) {
        if (err) {
            return callback(err, null);
        } else if (!tokens) {
            return callback(new Error('Tokens not found'), null);
        }
        let result = [];
        for (let i = 0; i < tokens.length; i++)
            result[i] = tokens[i];
        return callback(null, result);
    });
}

// Получить токены по id пользователя
Token.statics.GetByUserId = function(id, callback) {
    return this.find({ userId: id }, function(err, tokens) {
        if (err) {
            return callback(err, null);
        } else if (!tokens) {
            return callback(new Error('Tokens not found'), null);
        }
        let result = [];
        for (let i = 0; i < tokens.length; i++)
            result[i] = tokens[i];
        return callback(null, result);
    });
}

// Поиск токена по значению
Token.statics.GetByValue = function(value, callback) {
    return this.findOne({ value: value }, function (err, token) {
        if (err) {
            return callback(err, null);
        } else if (!token) {
            return callback(new Error('Token not found'), null);
        }
        return callback(null, token);
    });
}

// Удаление всех токенов из базы
Token.statics.Clear = function(callback) {
    return this.remove({}, function(err, result) {
        if (err) {
            return callback(err, null);
        } else if (!result) {
            return callback(new Error('Delete falied'), null);
        }
        return callback(null, result);
    });
}

// Формат для выдачи сервисного токена
Token.statics.Format = function(token) {
    return {
        token: token.value,
        expires_in: require('../../config').security.STLife
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