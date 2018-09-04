var express	 = require('express'),
	config 	 = require('./config'),
	log 	 = require('./config/log')(module),
	mongoose = require('mongoose'),
	raedline = require('readline');

var app = express();
module.exports = require('./config/express') (app, config);

app.listen(config.port, function(){
	log.info('Service listening on port ' + config.port);
});

// Подключение к БД
mongoose.connect(config.db);
var db = mongoose.connection;
var limit = 20,	// Кол-во допустимых попыток подключения 
	n = 1;		// Количество подключений

db.on('error', function(err) {
	log.warn('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Successful connection to MongoDB!");
});

// Создание интерфейса для ответа из командной строки
const rl = raedline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const interval = 10000; // 10с
var timer = setInterval(dbChecker, interval);

// Чекер подключения
function dbChecker () {
	if (db.readyState == 0 && limit > n) {
		log.info('Trying to connect to server (' + ++n + ')');
		mongoose.connect(config.db);	// Попытка восстановления подключения к БД
	} else if (n == limit) {
		n++;	// Пропуск подключения
	} else if (n == limit + 1) {
		rl.question('\nExceeded the number of atempts to connect.' + 
			' Refresh connection counter? (y/n) ', (answer) => {
			if (answer == 'y' || answer == 'Y') {
				n = 0;	// Сброс счетчика и перезапуск чекера подключения
				while (timer[0] != null) { }	// Цикл ожидания команды clearInterval
				timer = setInterval(dbChecker, interval);
			}
			else {
				log.error('Service couldn\'t restore the connection to MongoDB.' +
					' Please, fix the connection problems and restart the service.');
				n++;
			}
		});
		clearInterval(timer);
	}
}