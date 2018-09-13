var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                timestamp: true,
                colorize: true,
                level: 'debug', // Уровни вывода: error, warn, info, verbose, debug, silly
                label: path
            })
        ]
    });
}

module.exports = getLogger;