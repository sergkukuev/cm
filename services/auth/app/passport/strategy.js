const	crypto	= require('crypto'),
		cs		= require('./../../config').security;

// Необходимые модели БД
const 	User   	= require('./../models/user').model,
		Client 	= require('./../models/client').model,
		AToken  = require('./../models/tokens/access').model_a,
		UAToken = require('./../models/tokens/access').model_u,
		RToken 	= require('./../models/tokens/refresh').model;

module.exports = {
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
	},
	CheckService,
	CheckServiceByToken,
	CheckUser,
	SetNewAToken,
	GetUserCode
}

// Проверка сервиса по appId (name) и appSecret (pass)
function CheckService(service, done) {
	return Client.GetByData(service.name, service.pass, function(err, app) {
		if (err && err.name == 'ServiceTokenError')
			return done(err, 401, null);
		else if (err)
			return done(err, 500, null);
		return done(null, 200, app);
	});
}

// Проверка токена доступа
function CheckServiceByToken(token, done) {
	return AToken.GetByValue(token, function(err, token) {
		if (err && err.name == 'TokenError') {
			err.name = 'ServiceTokenError';
			return done(err, 401, null);
		} else if (err)
			return done(err, 500, null);
		// Проверка на срок жизни токена
		const life = (Date.now() - token.created) / 1000;
		if (life > cs.STLife) {
			token.remove(function(err) {
				if (err) {
					return done(err, 500, null);
				}
			});
			let err = new Error('Access token is expired');
			err.name = 'ServiceTokenError';
			return done(err, 401, null);
		}
		// Поиск клиента по идентификатору
		return Client.GetById(token.userId, function(err, app) {
			if (err && err.name == 'ServiceTokenError')
				return done(err, 401, null);
			else if (err)
				return done(err, 500, null);
			return done(null, 200, AToken.Format(token));
		});
	});
}

// Проверка пользователя по токену доступа
function CheckUser(token, done) {
	return UAToken.GetByValue(token, function(err, token) {
		if (err && err.name == 'TokenError') {
			err.name = 'UserTokenError';
			return done(err, 401, null);
		} else if (err)
			return done(err, 500, null);
		// Проверка на срок жизни токена
		const life = (Date.now() - token.created) / 1000;
		if (life > cs.STLife) {
			token.remove(function(err) {
				if (err) {
					return done(err, 500, null);
				}
			});
			let err = new Error('Access token is expired');
			err.name = 'UserTokenError';
			return done(err, 401, null);
		}
		// Поиск пользователя по идентификатору
		return User.GetById(token.userId, function(err, user) {	
			if (err)
				return done(err, 500, null);
			else if (!user)
				return done(new Error('User not found'), 404, null);
			return done(null, 200, user);
		});
	});
}

// Установка нового токена доступа
function SetNewAToken(application, done) {
	let token = {
		userId: application.id,
		value: crypto.randomBytes(32).toString('base64')
	};
	return AToken.Create(token, function(err, token) {
		err ? done(err, 500, null) : done(null, 201, AToken.Format(token));
		return;
	});
}

// Получение кода пользователя
function GetUserCode(data, done) {
	return User.GetByLogin(data.login, function(err, user) {
		if (err)
			return done(err, 500, null);
		else if (!user) 
			return done(new Error('User not found'), 404, null);
		else if (!user.Verify(data.password)) {
			return done(new Error('Login or password is wrong'), 400, null);
		}
		// Идентификация пройдена успешно, обновляем и выдаем код
		User.GetByCode(user.code, function(err, user) {
			if (err)
				return done(err, 500, null);
			else if (!user) 
				return done(new Error('User not found'), 404, null);
			return done(null, 202, user.code);
		});
	});
}