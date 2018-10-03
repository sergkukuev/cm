const   mongoose    = require('mongoose'),
        crypto      = require('crypto'),
        Schema      = mongoose.Schema;

const userGroups = ['User', 'Admin'];
module.exports.groups = userGroups;

// Модель пользователя
const User = new Schema({
    login: {
        type  : String, 
        unique: true,
        required : true
    },
    encPassword: {
        hash: {
            type: String, 
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    },
    created: {
        type: Date, 
        default: Date.now
    },
    code: {
        type: String
    },
    group: {
        type: String, 
        enum: userGroups,
        immutable: true,
        default: userGroups[0]
    }
});

const implug = require('mongoose-immutable');
User.plugin(implug);

// Создание пользователя
User.statics.Create = function(user, callback) {
    user = new User(user);  // Создаем модель токена из данных
    user.code = crypto.randomBytes(10).toString('base64');
    user.save(function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (!user) {
            return callback(myError('User not saved'));
        }
        return callback(null, user);
    });
}

// Получить пользователя по идентификатору
User.statics.GetById = function(id, callback) {
    return this.findById(id, function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (!user) {
            return callback(myError('User not found'));
        } 
        return callback(null, user);
    });
}

// Получить пользователя по информации
User.statics.GetByData = function(data, callback) {
    return this.findOne(data, function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (!user) {
            return callback(myError('User not found'));
        } 
        return callback(null, user);
    });
}

// Получить пользователя по коду
User.statics.GetByCode = function(oldCode, callback) {
    let newCode = crypto.randomBytes(10).toString('base64');
    return this.findOneAndUpdate({ code: oldCode }, { code: newCode }, { new: true }, function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (!user) {
            return callback(myError('User not found'));
        }
        return callback(null, user);
    });
}

// Получить пользователей определенной группы
User.statics.GetByGroup = function(group, callback) {
    return this.find({ group: group }, function(err, users) {
        if (err) {
            return callback(err, null);
        } else if (!users) {
            return callback(myError('Users not found'));
        } 
        let result = [];
        for (let i = 0; i < users.length; i++)
            result[i] = users[i];
        return callback(null, result);
    });
}

// Обновить информацию пользователя по id
User.statics.UpdateById = function(id, data, callback) {
    return this.findByIdAndUpdate(id, data, {new: true}, function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (!user) {
            return callback(myError('User not found'));
        }
        return callback(null, user);
    });
}

// Проверка пароля пользователя
User.methods.Verify = function(password){
    return encryptPassword(password) === this.encPassword.hash;
}

// Удаление пользователя по идентификатору
User.statics.DeleteById = function(id, callback) {
    this.findByIdAndRemove(id, function(err, user) {
        if (err) {
            return callback(err, null);
        } else if (!user) {
            return callback(myError('User not found'));
        }
        return callback(null, user);
    });
}

// Удаление всех пользователей из базы
User.statics.ClearByGroup = function(group, callback) {
    this.remove({ group: group }, function(err, result) {
        if (err) {
            return callback(err, null);
        } else if (!result) {
            return callback(myError('Delete failed'));
        }
        return callback(null, result);
    });
}

// Получить идентификатор
User.virtual('userId').get(function() {
    return this._id;
});

// Установить пароль
User.virtual('password').set(function(password){
    this.encPassword.salt = crypto.randomBytes(32).toString('base64');
    this.encPassword.hash = encryptPassword(password);
});

// Зашифровка пароля
function encryptPassword(password) {
    return crypto.createHmac('sha1', this.encPassword.salt).update(password).digest("hex");
}


// Формирование ошибки данных
function myError(message) {
    let err = new Error(message);
    err.name = 'UserError';
    return err;
}

mongoose.model('User', User);

const log = require('./../../config/log')(module);
var UserModel = mongoose.model('User');
module.exports.model = UserModel;

// Проверка администратора в базе
module.exports.VerifyAdmin = function(login, password, created) {
    UserModel.GetByData({ login: login }, function(err, user) {
        if (err) {
            log.error(`${err.status || 500} - ${err.message}`);
            log.debug(err.stack);
        }
        if (!created) {
            return;
        } else if (!user && created) {
            // Создать админа
            let admin = {
                login: login,
                password: password,
                group: userGroups[1]
            };
            return UserModel.Create(admin, function(err, admin) {
                if (err) {
                    log.error(`${err.status || 500} - ${err.message}`);
                    log.debug(err.stack);
                    return;
                }
                return log.info('Created new admin \'' + admin.login + '\'');
            });
        }
        user.group == userGroups[1] ? log.info('Admin \'' + login + '\' exists') : 
            log.warn('Cann\'t create admin. Login \'' + login + '\' already taken'); 
    });
}