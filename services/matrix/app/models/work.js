var mongoose = require('mongoose');

let Schema = mongoose.Schema;
let Work = new Schema({
    // Наименование работы
    name: {
        type: String, 
        required: true
    },
    // Список идентификаторов задач для данной работы
    tasks: [{
        type: Schema.Types.ObjectId
    }]
});