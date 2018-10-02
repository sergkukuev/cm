const   mongoose    = require('mongoose'),
        crypto      = require('crypto'),
        Schema      = mongoose.Schema;
const   immutablePlugin = require('mongoose-immutable');

const GROUPS = ['User', 'Admin'];
module.exports.groups = GROUPS;

// Модель пользователя
const User = new Schema({
    login: {
        type  : String, 
        unique: true,
        required : true
    },
    // Зашифрованный пароль
    hPassword: {
        type: String, 
        required: true
    },
    // Ключ для расшифровки пароля
    salt: {
        type: String,
        required: true
    },
    // Дата создания
    created: {
        type: Date, 
        default: Date.now
    },
    // Код пользователя
    code: {
        type: String
    },
    // Группа пользователя
    group: {
        type: String, 
        enum: GROUPS,
        immutable: true,
        default: GROUPS[0]
    }
});

User.plugin(immutablePlugin);

// Создание пользователя
User.statics.Create = function(user, callback) {
    user = new User(user);  // Создаем модель токена из данных
    user.code = crypto.randomBytes(10).toString('base64');
    user.save(function(err, user) {
        if (err)
            callback(err, null);
        else
            user ? callback(null, user) : callback(new Error('User not saved'), null);
        return;
    });
}

// Получить пользователя по идентификатору
User.statics.GetById = function(id, callback) {
    return this.findById(id, function(err, user) {
        if (err || !user) {
            err ? callback(err, null) : callback(null, null);
            return;
        } 
        return callback(null, user);
    });
}

// Получить пользователя по информации
User.statics.GetByData = function(data, callback) {
    return this.findOne(data, function(err, user) {
        if (err || !user) {
            err ? callback(err, null) : callback(null, null);
            return;
        }
        return callback(null, user);
    });
}

// Получить пользователя по коду
User.statics.GetByCode = function(oldCode, callback) {
    let newCode = crypto.randomBytes(10).toString('base64');
    return this.findOneAndUpdate({ code: oldCode }, { code: newCode }, { new: true }, function(err, user) {
        if (err || !user) {
            err ? callback(err, null) : callback(null, null);
            return;
        }
        return callback(null, user);
    });
}

// Проверка пароля пользователя
User.methods.Verify = function(password){
    return encryptPassword(password) === this.hPassword;
}

// Получить идентификатор
User.virtual('userId').get(function() {
    return this.id;
});

// Установить пароль
User.virtual('password').set(function(password){
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hPassword = encryptPassword(password);
});

// Зашифровка пароля
function encryptPassword(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest("hex");
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
                group: GROUPS[1]
            };
            return UserModel.Create(admin, function(err, admin) {
                if (err) {
                    log.error(`${err.status || 500} - ${err.message}`);
                    log.debug(err.stack);
                    return;
                } else if (admin) {
                    let err = new Error('Admin not saved')
                    log.error(`${err.status || 500} - ${err.message}`);
                    log.debug(err.stack);
                    return;
                }
                log.info('Created new admin \'' + admin.login + '\'');
                return;
            });
        }
        user.group == GROUPS[0] ? log.warn('User with this login \'' + login + '\' already exists') : 
            log.info('Admin \'' + login + '\' exists'); 
    });
}