var mongoose = require('mongoose');

let Schema = mongoose.Schema;
// Контейнер для хранения оценок человечков
let MarkHolder = new Schema({
	// ID человечка в средствах авторизации
	id_user: Schema.Types.ObjectId,
    // Данные о навыках человечка
    test: [{
        // ID знания
		id_knowledge: Schema.Types.ObjectId, 
		// Уровень знаний человечка (0 - знание отсутствует, 4 - уровень эксперта)
		mark: {
			type: Number,
			min: 0,
			max: 4, 
			required: true
		}
    }]
});

MarkHolder.virtual('date').get(function() {
    return this._id.getTimestamp();
});

MarkHolder.statics.create = function(user, callback) {
    return user.save(function(err, result) {
		err ? callback(err, null) : (result  ? callback(null, Format(result)) : callback(null, null));
	});
}

MarkHolder.statics.get = function(page, count, callback) {
    if (count == 0) {
        return this.find(function(err, user) {
            ReadArray(err, user, callback);
        });
    }
    else {
        return this.find(function(err, user) {
            ReadArray(err, user, callback);
        }).skip(page * count).limit(count);
    }
}

function ReadArray(err, arr, callback) {
	if (err)
		callback(err, null);
	else {
		if (arr) {
			let result = [];
			for (let i = 0; i < arr.length; i++)
				result[i] = Format(arr[i]);
			callback(null, result);
		}
		else
			callback(null, null);
	}
}

MarkHolder.statics.getById =  function(id, callback) {
    return this.findById(id, function(err, user) {
        err ? callback(err, null) : (user ? callback(null, Format(user)) : callback(null, null));
    });
}

MarkHolder.statics.getByUserId =  function(id, callback) {
    return this.findOne({ id_user: id }, function(err, user) {
        err ? callback(err, null) : (user ? callback(null, Format(user)) : callback(null, null));
    });
}

MarkHolder.statics.updateById = function(id, data, callback) {
    return this.findByIdAndUpdate(id, data, { new: true }, function(err, user) {
        err ? callback(err, null) : (user ? callback(null, Format(user)) : callback(null, null));
    });
}

MarkHolder.statics.updateByUserId = function(id, data, callback) {
	return this.findOneAndUpdate({ id_user: id }, data, {new: true}, function(err, user) {
		err ? callback(err, null) : (user ? callback(null, Format(user)) : callback(null, null));
	});
}

MarkHolder.statics.deleteById = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, user) {
		err ? callback(err, null) : (user ? callback(null, Format(user)) : callback(null, null));
	});
}

MarkHolder.statics.delete = function(callback) {
	return this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

// Формирование JSON объекта
function Format(obj) {
	let test = [];
	if (obj.test != null) {
		for (let i = 0; i < obj.test.length; i++) {
			let temp = {
				id_knowledge: obj.test[i].id_knowledge,
				mark: obj.test[i].mark
			}
			test.push(temp);
		}
	}
	let item = {
		id: obj.id_user,//obj._id,
		//user_id: obj.id_user,
		test: test
	}

	let flag = false;
	for (let element in item)
		if (element == undefined || element == null)
			flag = true;

	// Хоть одно поле нераспознано, кидаем пустой JSON
	if (flag)
        item = null;
	return item;
}

MarkHolder.statics.Format = function(user) {
	return Format(user);
}

mongoose.model("MarkHolder", MarkHolder);