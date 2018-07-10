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

MarkHolder.statics.create = function(obj, callback) {
	return obj.save(function(err, obj) {
		err ? callback(err, null) : callback(null, Format(obj));
	});
}

MarkHolder.statics.get = function(page = 0, count = 0, callback) {
	if (count == 0) {
		return this.find(function(err, users) {
			if (err)
				callback(err, null);
			else {
				if (users) {
					let result = [];
					for (let i = 0; i < users.length; i++)
						result[i] = Format(users[i]);
					callback(null, result);
				}
				else
					callback(null, null);
			}	
		});
	}
	else {
		return this.find(function(err, users) {
			if (err)
				callback(err, null);
			else {
				if (users) {
					let result = [];
					for (let i = 0; i < users.length; i++)
						result[i] = Format(users[i]);
					callback(null, result);
				}
				else
					callback(null, null);
			}	
		}).skip(page * count).limit(count);
	}
}

MarkHolder.statics.getById = function(id, callback) {
	return this.find({ id_user: id }, function(err, obj) {
		err ? callback(err, null) : (obj ? callback(null, Format(obj)) : callback(null, null));
	});
}

MarkHolder.statics.updateById = function(data, callback) {
	return this.findAndUpdate({ id_user: data.id }, { test: data.test }, { new: true }, function(err, obj) {
		err ? callback(err, null) : (obj ? callback(null, Format(obj)) : callback(null, null));
	});
}

MarkHolder.statics.deleteById = function(id, callback) {
	return this.findAndRemove({ id_user: id }, function(err, obj) {
		err ? callback(err, null) : (obj ? callback(null, Format(obj)) : callback(null, null));
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
	for (let i = 0; i < obj.test.length; i++) {
		let temp = {
			id_knowledge: obj.test[i].id_knowledge,
			mark: obj.test[i].mark
		}
		test.push(temp);
	}
	let marks = {
		id: obj.id_user,
		test: test
	}
	return marks;
}

MarkHolder.statics.Format = function(user) {
	return Format(user);
}

mongoose.model("MarkHolder", MarkHolder);