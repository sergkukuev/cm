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
    created: {
        type: Date, 
        default: Date.now
    },
    code: String    // Код пользователя
});

// Получить список всех пользователей
User.statics.getAll = function(callback) {
    return this.find(function(err, users) {
        if (err)
            return callback(err, null);
        if (users) {
            let result = [];
            for (let i = 0; i < users.length; i++)
                result[i] = users[i];
            return callback(null, result);
        }
        return callback(null, null);
    });
}

// Обновить код доступа
User.statics.updateCode = function(info, callback) {
    let code = crypto.randomBytes(10).toString('base64');
    return this.findOneAndUpdate({ code: info }, { code: code }, { new: true }, function(err, user) {
        err ? callback(err, null) : (user ? callback(null, user) : callback(null, null));
    });
}

// Создание пользователя
User.statics.create = function(user, callback) {
    user.code = crypto.randomBytes(10).toString('base64');
    return user.save(callback);
}

// Зашифровка пароля
User.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest("hex");
}

// Проверка пароля пользователя
User.methods.verify = function(password){
    return this.encryptPassword(password) === this.hPassword;
}

// Удаление пользователя по идентификатору
User.methods.deleteById = function(id, callback) {
    return this.findByIdAndRemove(id, function(err, user) {
        err ? callback(err, null) : (user ? callback(null, Format(user)) : callback(null, null));
    })
}

// Удаление всех пользователей
User.methods.delete = function(callback) {
    return this.remove({}, function(err, result) {
        err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
    })
}

// Получить идентификатор
User.virtual('userID').get(function() {
    return this.id;
});

// Установить пароль
User.virtual('password').set(function(password){
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hPassword = this.encryptPassword(password);
});

// Формат на выдачу элемента
function Format(user) {
    let item = {
        id      : user._id,
        login   : user.login,
        group   : user.group,
        created : user.created
    };
	let flag = false;
	for (let element in item)
		if (element == undefined || element == null)
			flag = true;

	// Хоть одно поле нераспознано, кидаем пустой JSON
	if (flag)
		item = null;
    return item;
}

mongoose.model('User', User);

var UserModel = mongoose.model('User');
module.exports.model = UserModel;