const crypto 	= require('crypto'),
      life 		= require('./../../config').security.USLife,
      Client 	= require('./../models/client').model,
      AToken 	= require('./../models/tokens/access').model;

module.exports = {
	// Проверка сервиса по appId и appSecret
	CheckService : function(appId, appSecret, done) {
		return Client.findOne({appId : appId}, function(err, app_cli) {
			if (err)
				return done(err, 500);
			else if (!app_cli) {
				let err = new Error('Application with this appId and appSecret not found');
				err.name = 'ServiceTokenError';
				return done(err, 401, false);
			} else if (app_cli.appSecret != appSecret) {
				let err = new Error('Application with this appId and appSecret not found');
				err.name = 'ServiceTokenError';
				return done(err, 401, false);
			}
			return done(null, null, app_cli);
		});
	},
    // Проверка токена доступа
	CheckServiceAToken : function(accessToken, done) {
		return AToken.findOne({token : accessToken}, function(err, token) {
			if (err)
				return done(err, 500);
			else if (!token) {
				let err = new Error('Application with this access token not found');
				err.name = 'ServiceTokenError';
				return done(err, 401, false);
			}

			const tempLife = (Date.now() - token.created) / 1000;	// Вычисление времени жизни токена
			if (tempLife > life) {	// Сравнение с конфигурацией
				token.remove(function(err) {
					if (err)
						return done(err, 500, false);
				});
				let err = new Error('Access token is expired');
				err.name = 'ServiceTokenError';
				return done(err, 401, false);
			}

			const appId = token.userID;
			return Client.findById(appId, function(err, application) {
				if (err) { 
					return done(err, 500, false);
				} else if (!application) {
					return done(new Error('Wrong access token'), 404, false);
				} else
					return done(null, null, true);
			});
		});
	},
	// Установка нового токена доступа
	SetNewAToken : function(application, done) {
		let tokenValue = crypto.randomBytes(32).toString('base64');
		let token = new AToken({
			appId	: application.id,
			token 	: tokenValue
		});
		return token.save(function(err, token) {
			if (err)
				return done(err, 500, null);
			else if (!token)
				return done(new Error('Token not saved'), 500, null);

			let result = {
				token : tokenValue,
				expires_in : life
			};
			return done(null, null, result);
		});
	}
}