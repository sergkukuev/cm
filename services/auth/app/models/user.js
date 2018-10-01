const   mongoose    = require('mongoose'),
        crypto      = require('crypto'),
        Schema      = mongoose.Schema;

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
    }
});

// Создание пользователя
User.statics.create = function(user, callback) {
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

// Получить пользователя по логину/паролю
User.statics.GetByLogin = function(login, callback) {
    return this.findOne({ login: login }, function(err, user) {
        if (err || !user) {
            err ? callback(err, null) : callback(null, null);
            return;
        }
        return callback(null, user);
    });
}

// Получить пользователя по коду
User.statics.GetByCode = function(oldCode) {
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
    return EncryptPassword(password) === this.hPassword;
}

// Получить идентификатор
User.virtual('userId').get(function() {
    return this.id;
});

// Установить пароль
User.virtual('password').set(function(password){
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hPassword = EncryptPassword(password);
});

// Зашифровка пароля
function EncryptPassword(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest("hex");
}

mongoose.model('User', User);

var UserModel = mongoose.model('User');
module.exports.model = UserModel;