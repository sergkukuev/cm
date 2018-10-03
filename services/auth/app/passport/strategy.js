const	crypto	= require('crypto'),
		cs		= require('./../../config').security;

// Необходимые модели БД
const 	User   	= require('./../models/user').model,
		Client 	= require('./../models/client').model,
		SToken  = require('./../models/token').model_s,
		UToken = require('./../models/token').model_u,
		RToken 	= require('./../models/token').model_r;

module.exports = {
	// Проверка сервисной авторизации
	CheckService,		// Проверка авторизации сервиса по appId и appSecret
	CheckServiceByToken,// Проверка авторизации по токену доступа
	SetNewToken,		// Установка нового токена доступа
	// Проверка авторизации пользователя
	CheckUser,		// Проверка авторизации по токену
	GetUserCode,	// Получить код пользователя
	// Обновление токенов пользователя
	UTokenByCode,	
	UTokenByPass,	
	UTokenByToken	
}

// Проверка сервиса по appId (name) и appSecret (pass)
function CheckService(service, done) {
	return Client.GetByData(service.name, service.pass, function(err, app) {
		if (err && err.name == 'ClientError') {
			err.name = cs.name.service;
			return done(err, 401, null);
		} else if (err) {
			return done(err, 500, null);
		}
		return done(null, 200, app);
	});
}

// Проверка токена доступа
function CheckServiceByToken(token, done) {
	return SToken.GetByValue(token, function(err, token) {
		if (err && err.name == 'TokenError') {
			err.name = cs.name.service;
			return done(err, 401, null);
		} else if (err) {
			return done(err, 500, null);
		}
		// Проверка на срок жизни токена
		const life = (Date.now() - token.created) / 1000;
		if (life > cs.STLife) {
			token.remove(function(err) {
				if (err) {
					return done(err, 500, null);
				}
			});
			let err = new Error('Access token is expired');
			err.name = cs.name.service;
			return done(err, 401, null);
		}
		// Поиск клиента по идентификатору
		return Client.GetById(token.userId, function(err, app) {
			if (err && err.name == 'ClientError') {
				err.name = cs.name.service;
				return done(err, 401, null);
			} else if (err) {
				return done(err, 500, null);
			}
			return done(null, 200, SToken.Format(token));
		});
	});
}

// Установка нового токена доступа для сервиса
function SetNewToken(application, done) {
	let token = {
		userId: application.id,
		value: crypto.randomBytes(32).toString('base64')
	};
	return SToken.Create(token, function(err, token) {
		err ? done(err, 500, null) : done(null, 201, SToken.Format(token));
		return;
	});
}

// Проверка пользователя по токену доступа
function CheckUser(token, done) {
	return UToken.GetByValue(token, function(err, token) {
		if (err && err.name == 'TokenError') {
			err.name = cs.name.user;
			return done(err, 401, null);
		} else if (err) {
			return done(err, 500, null);
		}	
		// Проверка на срок жизни токена
		const life = (Date.now() - token.created) / 1000;
		if (life > cs.UTLife) {
			token.remove(function(err) {
				if (err) {
					return done(err, 500, null);
				}
			});
			let err = new Error('Access token is expired');
			err.name = cs.name.user;
			return done(err, 401, null);
		}
		// Поиск пользователя по идентификатору
		return User.GetById(token.userId, function(err, user) {	
			if (err && err.name == 'UserError') {
				return done(err, 404, null);
			} else if (err) {
				return done(err, 500, null);
			}
			return done(null, 200, user);
		});
	});
}

// Получение кода пользователя
function GetUserCode(data, done) {
	return User.GetByData({ login: data.login }, function(err, user) {
		if (err && err.name == 'UserError') {
			return done(err, 404, null);
		} else if (err) {
			return done(err, 500, null);
		} else if (!user.Verify(data.password)) {
			return done(new Error('Login or password is wrong'), 401, null);
		}
		// Идентификация пройдена успешно, обновляем и выдаем код
		User.GetByCode(user.code, function(err, user) {
			if (err && err.name == 'UserError') {
				return done(err, 404, null);
			} else if (err) {
				return done(err, 500, null);
			}
			return done(null, 202, user.code);
		});
	});
}

// Создание токенов для пользователя по коду
function UTokenByCode(code, done) {
	return User.GetByData({ code: code }, function(err, user) {
		if (err && err.name == 'UserError') {
			return done(err, 404, null);
		} else if (err) {
			return done(err, 500, null);
		}
		return refreshUToken(user._id, null, done);
	});
}

// Создание токенов для пользователя по паролю
function UTokenByPass(data, done) {
	return User.GetByData({ login: data.login }, function(err, user) {
		if (err && err.name == 'UserError') {
			return done(err, 404, null);
		} else if (err) {
			return done(err, 500, null);
		} else if (!user.Verify(data.password)) {
			return done(new Error('Login or password is wrong'), 401, null);
		}
		return refreshUToken(user._id, null, done);
	});
}

// Создание токенов для пользователя по токену
function UTokenByToken(refresh, done) {
	RToken.GetByValue(refresh, function(err, token) {
		if (err && err.name == 'TokenError') {
			return done(err, 404, null);
		} else if (err) {
			return done(err, 500, null);
		}
		return User.GetById(token.userId, function(err, user) {
			if (err && err.name == 'UserError') {
				return done(err, 404, null);
			} else if (err) {
				return done(err, 500, null);
			}
			return refreshUToken(user._id, token.created, done);
		});
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Удаление и создание токенов доступа и обновления
function refreshUToken(userId, life, done) {
	return deleteUToken(userId, life, function(err, status) {
		if (err) {
			return done(err, status, null);
		}
		return createUToken(userId, function(err, status, result) {
			err ? done(err, status, null) : done(null, status, result);
		});
	});
}

// Удаление токенов
function deleteUToken(userId, life, done) {
	// Удаление токена обновления
	RToken.remove({ userId: userId }, function(err) {
		if (err) {
			return done(err, 500);
		}
	});
	// Проверка на срок жизни токена
	// если обновление происходит по токену обновления
	let alife = true;
	if (life) {
		life = (Date.now() - life) / 1000;
		if (life > cs.RTLife) {
			alife = false;	// Токен стух
		}
	}
	if (!alife) {	
		let err = new Error('Refresh token is expired');
		err.name = cs.name.user;
		return done(err, 401);
	} else {	// Токен жив или обновление не по токену (удаляем старый токен доступа)
		return UToken.remove({ userId: userId }, function(err) {
			err ? done(err, 500) : done(null, 200);
			return;
		});
	}
}

// Создание токенов
function createUToken(userId, done) {
	// Создание токенов
	let token = {
		value: crypto.randomBytes(32).toString('base64'),
		userId: userId
	};
	return RToken.Create(token, function(err, refresh_token) {
		if (err) {
			return done(err, 500, null);
		}
		token.value = crypto.randomBytes(32).toString('base64');
		UToken.Create(token, function(err, access_token) {
			if (err) {
				return done(err, 500, null);
			}
			let result = {
				access: access_token.value,
				refresh: refresh_token.value,
				expires_in: cs.UTLife
			};
			return done(null, 201, result);
		});
	});
}