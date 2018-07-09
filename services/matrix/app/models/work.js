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
		err ? callback(err, null) : callback(null, Format(result));
	});
}

Work.statics.get = function(page, count, callback) {
    if (count == 0) {
        return this.find(function(err, work) {
            if (err)
                callback(err, null);
            else {
                if (work) {
                    let res = [];
                    for (let i = 0; i < work.length; i++)
                        res[i] = Format(work[i]);
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
                        res[i] = Format(work[i]);
                    callback(null, res);
                }
                else
                    callback(null, null);
            }
        }).skip(page * count).limit(count);
    }
}

Work.statics.getById =  function(id, callback) {
    return this.findById(id, function(err, work) {
        err ? callback(err, null) : (work ? callback(null, Format(work)) : callback(null, null));
    });
}

Work.statics.updateById = function(id, data, callback) {
    return this.findByIdAndUpdate(id, { 
        name: data.name, 
        tasks: data.tasks 
    }, { new: true }, function(err, work) {
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
    
    let item = {
        id: work._id,
        name: work.name,
        tasks: tasks
    };
    return item;
}

Work.statics.Format = function(work) {
    return Format(work);
}

mongoose.model("Work", Work);