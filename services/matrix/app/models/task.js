var mongoose = require('mongoose');

let Schema = mongoose.Schema;
// Модель задач для работ
let Task = new Schema({
	// Наименование задачи
	name: {	
		type: String,
		required: true
	},
	// Ранг текущей задачи (0 - ведущий, 1 - 1кат, 2 - 2кат, 3 - 3кат, 4 - без кат)
	rank: { 
        type: Number,
        min: 0,
        max: 4,
		default: 3
	},
	// Требуемые знания для выполнения задачи
	need: [{
		// ID знания
		id_knowledge: Schema.Types.ObjectId, 
		// Необходимый уровень знаний (0 - знание не требуется, 4 - необходим уровень эксперта)
		mark: {
			type: Number,
			min: 1,
			max: 4, 
			required: true
		}
	}]
});

Task.statics.create = function(work, callback) {
    return work.save(callback);
}

Task.statics.read = function(page = 0, count = 0, callback) {
    if (count == 0) {
        return this.find(function(err, work) {
            if (err)
                callback(err, null);
            else {
                if (work) {
                    let res = [];
                    for (let i = 0; i < work.length; i++)
                        res[i] = getTask(work[i]);
                    callback(null, res);
                }
                else
                    callback(null, null);
            }
        });
    }
    else {
        return this.find(function(err, work) {
            if (err)
                callback(err, null);
            else {
                if (work) {
                    let res = [];
                    for (let i = 0; i < work.length; i++)
                        res[i] = getTask(work[i]);
                    callback(null, res);
                }
                else
                    callback(null, null);
            }
        }).skip(page * count).limit(count);
    }
}

Task.statics.read =  function(id, callback) {
    return this.findById(id, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, getTask(work)) : callback(null, null));
    });
}

Task.statics.update = function(id, data, callback) {
    return this.findByIdAndUpdate(id, { 
        name: data.name, 
        tasks: data.tasks 
    }, { new: true }, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, getTask(work)) : callback(null, null));
    });
}

Task.statics.delete = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, work) {
		err ? callback(err, null) : (obj ? callback(null, getTask(work)) : callback(null, null));
	});
}

Task.statics.clear = function(callback) {
	return this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

function getTask(obj) {
	let task = {
		"name": obj.name,
		"rank": obj.rank,
		"need": obj.need
	}
}

mongoose.model("Task", Task);