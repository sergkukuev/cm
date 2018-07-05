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
	return obj.save(callback);
}

MarkHolder.statics.read = function(id, callback) {
	return this.find({ id_user: id }, function(err, obj) {
		err ? callback(err, null) : (obj ? callback(null, getUserMarks(obj)) : callback(null, null));
	});
}

MarkHolder.statics.update = function(data, callback) {
	return this.findAndUpdate({ id_user: data.id }, { 
		id_user: data.id, 
		test: data.test
	}, { new: true }, function(err, obj) {
		err ? callback(err, null) : (obj ? callback(null, getUserMarks(obj)) : callback(null, null));
	});
}

MarkHolder.statics.delete = function(id, callback) {
	return this.findAndRemove({ id_user: id }, function(err, obj) {
		err ? callback(err, null) : (obj ? callback(null, getUserMarks(obj)) : callback(null, null));
	});
}

MarkHolder.statics.clear = function(callback) {
	return this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

// Формирование JSON объекта
function getUserMarks(obj) {
	let marks = {
		"id": obj.id_user,
		"data": obj.test
	}
	return marks;
}

mongoose.model("MarkHolder", MarkHolder);