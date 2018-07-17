var mongoose = require('mongoose');

let Schema = mongoose.Schema;
// Модель знаний
let Knowledge = new Schema({
	// Наименование знания
	name: {	
		type: String,
		required: true
	},
	// Основная категория
	ctgr: { 
		type: String,
		default: "-"
	},
	// Подкатегория знания
	sctgr: {
		type: String,
		default: "-"
	},
	// Ранжирование знания (Массив из 4-ех рангов: 0 - базовый уровень, 4 уровень эксперта)
	marks: [{
		type: String,
		required: true
	}]
});

Knowledge.virtual('date').get(function() {
		return this._id.getTimestamp();
	});

// Create
Knowledge.statics.create = function(knowledge, callback) {
	return knowledge.save(function(err, result) {
		err ? callback(err, null) : (result ? callback(null, Format(result)) : callback (null, null));
	});
}

// Read
Knowledge.statics.get = function(page = 0, count = 0, callback) {
	if (count == 0) {
		return this.find(function(err, knowledges) {
			ReadArray(err, knowledges, callback);
		});
	}
	else {
		return this.find(function(err, knowledges) {
			ReadArray(err, knowledges, callback);
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

Knowledge.statics.getById = function(id, callback) {
	return this.findById(id, function(err, knowledge) {
		err ? callback(err, null) : (knowledge ? callback(null, Format(knowledge)) : callback(null, null));
	});
}

// Update
Knowledge.statics.updateById = function(id, data, callback) {
	return this.findByIdAndUpdate(id, data, {new: true}, function(err, knowledge) {
		err ? callback(err, null) : (knowledge ? callback(null, Format(knowledge)) : callback(null, null));
	});
}

// delete
Knowledge.statics.deleteById = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, knowledge) {
		err ? callback(err, null) : (knowledge ? callback(null, Format(knowledge)) : callback(null, null));
	});
}

Knowledge.statics.delete = function(callback) {
	this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

function Format(kn) {
	let item = {
		id		: kn._id,
		name	: kn.name,
		ctgr	: kn.ctgr,
		sctgr	: kn.sctgr,
		marks	: kn.marks
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

Knowledge.statics.Format = function(knowledge) {
	return Format(knowledge);
}

mongoose.model("Knowledge", Knowledge);