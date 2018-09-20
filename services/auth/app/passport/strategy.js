const	crypto	= require('crypto'),
		cs		= require('./../../config').security;

// Необходимые модели БД
const 	User   	= require('./../models/user').model,
		Client 	= require('./../models/client').model,
		AToken  = require('./../models/tokens/access').model,
		UAToken = require('./../models/tokens/users_access').model,
		RToken 	= require('./../models/tokens/refresh').model;

module.exports = {
	// Получение кода пользователя
	GetUserCode : function (login, password, done) {
		return User.findOne({login: login}, function (err, user) {
			if (err) {
				return done(err, 500, null);
			} else if (!user) {
				return done(new Error('User not found'), 500, null);
			} else if (!user.verify(password)) {
				return done(new Error('Password is wrong'), 400, null);
			}
			// Обновление кода
			User.updateCode(user.code, function (err, result) {
				err ? done(err, 500, null) : done(null, 200, result.code);
				return;
			});
		});
	},
	// Установка нового токена доступа
	SetNewAToken : function(application, done) {
		let tokenValue = crypto.randomBytes(32).toString('base64');
		let token = new AToken({
			userID	: application.id,
			token 	: tokenValue
		});
		return token.save(function(err, token) {
			if (err)
				return done(err, 500, null);
			else if (!token)
				return done(new Error('Token not saved'), 500, null);

			let result = {
				token : tokenValue,
				expires_in : cs.STLife
			};
			return done(null, null, result);
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

			const timeLife = (Date.now() - token.created) / 1000;	// Вычисление времени жизни токена
			if (timeLife > cs.STLife) {	// Сравнение с конфигурацией
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
	// Проверка сервиса только по appId
	CheckServiceById : function(appId, done) {
		return Client.findOne({appId: appId}, function (err, app_cli) {
			if (err)
				return done(err, 500);
			else if (!app_cli) {
				let err = new Error('Application with this appId not found');
				err.name = 'ServiceTokenError';
				return done(err, 401);
			}
			return done(null, 200, true);
		});
	},
	// Проверка пользователя по токену доступа
	СheckUserByAToken : function(accessToken, done) {
		UAToken.findOne({token : accessToken},function(err, token) {
			if (err)
				return done(err, 500);
			if (!token)
				return done(new Error('Access token not found'), 401, false);

			const timeLife = Math.round((Date.now() - token.created) / 1000);	// Вычисление времени жизни токена
			if(timeLife > cs.UTLife) { 	// Сравнение с конфигурацией
				UAToken.remove({token : accessToken}, function(err) {
					if (err) 
						return done(err, 500);
				});
				return done(new Error('Token expired'), 401);
			}
			// Поиск пользователя по идентификатору
			return User.findById(token.userID, function(err, user) {	
				if (err)
					return done(err, 500);
				if (!user)
					return done(new Error('Unkown user'), 401);
				return done(null, null, user);
			});
		});	
	},
	// Создание токенов для пользователя по коду
	UTokenByCode : function(code, done) {
		return User.findOne({code: code}, function(err, user) {
			if (err)
				return done(err, 500);
			if (!user)
				return done(new Error('User with this code not found'), 401, false);
			// Удаление старых токенов
			RToken.remove({userID: user.userID}, function(err) {
				if (err)
					return done(err);
				return;
			});
			UAToken.remove({userID : user.userID}, function(err) {
				if (err)
					return done(err);
				return;
			});
			// Создание токенов
			let tokenValue = crypto.randomBytes(32).toString('base64');
			let refreshTokenValue = crypto.randomBytes(32).toString('base64');
			let token = new UAToken({
				token : tokenValue,
				userID: user.id
			});
			let refreshToken = new RToken({
				token : refreshTokenValue, 
				userID: user.id
			});
			return refreshToken.save(function(err) {
				if (err)
					return done(err, 500);
				token.save(function(err, token) {
					if (err)
						return done(err, 500);
					let result = {
						user: user,
						access_token: tokenValue,
						refresh_token: refreshTokenValue,
						expires_in: cs.userTokenLife
					}
					return done(null, null, result);
				});
			});
		});
	},
	// Создание токенов для пользователя по паролю
	UTokenByPass : function(data, done) {
		return User.findOne({login: data.login}, function(err, user) {
			if (err)
				return done(err, 500);
			if (!user)
				return done(new Error('User with this login and password not found'), 401, false);
			if (!user.verify(data.pass))
				return done(new Error('Wrong password for this user'), 400, false);
			// Удаление старых токенов
			RToken.remove({userID: user.userID}, function(err) {
				if (err)
					return done(err);
			});
			UAToken.remove({userID : user.userID}, function(err) {
				if (err)
					return done(err);
			});
			// Создание токенов
			let tokenValue = crypto.randomBytes(32).toString('base64');
			let token = new UAToken({
				token : tokenValue,
				userID: user.id
			});
			return token.save(function(err, token) {
				if (err)
					return done(err, 500);
				else if (!token)
					return done(new Error('Token was not saved'), 500, false);
				let result = {
					user: user,
					access_token: token,
					expires_in: cs.userTokenLife
				}
				return done(null, null, result);
			});
		});
	},
	// Создание токенов для пользователя по токену
	UTokenByToken : function(refreshToken, done) {
		RToken.findOne({token : refreshToken}, function(err, token) {
			if (err)
				return done(err, 500);
			if (!token)
				return done(new Error('Refresh token not found'), 404, false);
			
			return User.findById(token.userID, function(err, user) {
				if (err)
					return done(err, 500);
				if (!user)
					return done(new Error('User by this refresh token not found'), 404, false);
				// Удаление старых токенов
				RToken.remove({userID : user.userID}, function(err) {
					if (err)
						return done(err, 500);
				});
				UAToken.remove({userID : user.userID}, function(err) {
					if (err)
						return done(err, 500);
				});
				// Создание токенов
				let tokenValue = crypto.randomBytes(32).toString('base64');
				let refreshTokenValue = crypto.randomBytes(32).toString('base64');	
				let token = new UAToken({
					token : tokenValue, 
					userID: user.userID 
				});
				let refToken = new RToken({
					token : refreshTokenValue, 
					userID: user.userID
				});
				refToken.save(function(err) {
					if (err)
	    				return done(err, 500);
				});
				return token.save(function(err, token) {
					if (err)
						return done(err, 500);
					else if (!token)
						return done(new Error('Token was not saved'), 500, false);
					let result = {
						access_token : tokenValue,
						refresh_token : refreshTokenValue,
						expires_in : cs.userTokenLife
					}
					return done(null, null, result);
				});
			});
		});
	}
}