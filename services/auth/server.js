var express	 = require('express'),
	config 	 = require('./config'),
	log 	 = require('./config/log')(module),
	mongoose = require('mongoose'),
	readline = require('readline');

var app = express();
module.exports = require('./config/express') (app, config);

app.listen(config.port, function() {
	log.info('Listening on port', config.port);
});

// Подключение к БД
mongoose.connect(config.db);
var db = mongoose.connection;
var limit = 60,	// Кол-во допустимых попыток подключения
	n = 1;		// Количество подключений

db.on('error', function(err) {
	log.error(`FAILED - MongoError - ${err.message}`);
	log.debug(err.stack);
});

db.once('open', function callback() {
	log.info('SUCCESS - Mongo connected');
});

// Создание интерфейса для ответа из командной строки
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const interval = 5000; // 5c
var timer = setInterval(dbChecker, interval);

// Чекер подключения
function dbChecker () {
	if (db.readyState == 0 && limit > n) {
		++n;
		log.warn('Trying reconnect ' + n + '...');
		mongoose.connect(config.db);	// Попытка восстановления подключения к БД
	} else if (n == limit) {
		n++;	// Пропуск подключения
	} else if (n == limit + 1) {
		let err = new Error('Exceeded attempts');
		log.error(`FAILED - MongoError - ${err.message}`);
		rl.question('\nTry again ? (y/n) ', (answer) => {
			if (answer == 'y' || answer == 'Y') {
				n = 0;	// Сброс счетчика и перезапуск чекера подключения
				while (timer[0] != null) { }	// Цикл ожидания команды clearInterval
				timer = setInterval(dbChecker, interval);
			}
			else {
				log.error(`FATALERROR - Please, correct the problem and restart the service`);
				n++;
			}
		});
		clearInterval(timer);
	}
}