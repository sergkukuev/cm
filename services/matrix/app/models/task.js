var mongoose = require('mongoose');

let Schema = mongoose.Schema;
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