var mongoose = require('mongoose');

let Schema = mongoose.Schema;
let User = new Schema({
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