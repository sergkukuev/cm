var mongoose = require('mongoose');

let Schema = mongoose.Schema;
// Модель работ
let Work = new Schema({
    // Наименование работы
    name: {
        type: String, 
        required: true
    },
    // Требуемые задачи для даной работы
    tasks: [{
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
    }]
});

Work.virtual('date').get(function() {
    return this._id.getTimestamp();
});

Work.statics.create = function(work, callback) {
    return work.save(function(err, result) {
		err ? callback(err, null) : (result  ? callback(null, Format(result)) : callback(null, null));
	});
}

Work.statics.get = function(page, count, callback) {
    if (count == 0) {
        return this.find(function(err, work) {
            ReadArray(err, work, callback);
        });
    }
    else {
        return this.find(function(err, work) {
            ReadArray(err, work, callback);
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

Work.statics.getById =  function(id, callback) {
    return this.findById(id, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, Format(work)) : callback(null, null));
    });
}

Work.statics.updateById = function(id, data, callback) {
    return this.findByIdAndUpdate(id, data, { new: true }, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, Format(work)) : callback(null, null));
    });
}

Work.statics.deleteById = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, work) {
		err ? callback(err, null) : (work ? callback(null, Format(work)) : callback(null, null));
	});
}

Work.statics.delete = function(callback) {
	return this.remove({}, function(err, result) {
		err ? callback(err, null) : (result ? callback(null, result) : callback(null, null));
	});
}

function Format(work) {
    let tasks = [];
    if (work.tasks != null) {
        for (let i = 0; i < work.tasks.length; i++) {
            let kn_info = [];
            for (let j = 0; j < work.tasks[i].need.length; j++) {
                let temp = {
                    id_knowledge: work.tasks[i].need[j].id_knowledge,
                    mark: work.tasks[i].need[j].mark
                }
                kn_info.push(temp);
            }
            let task = {
                id: work.tasks[i]._id,
                name: work.tasks[i].name,
                rank: work.tasks[i].rank,
                need: kn_info
            };
            tasks.push(task);
        }
    }
    
    let item = {
        id: work._id,
        name: work.name,
        tasks: tasks
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

Work.statics.Format = function(work) {
    return Format(work);
}

mongoose.model("Work", Work);