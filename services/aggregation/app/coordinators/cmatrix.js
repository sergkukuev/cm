// Обработки запросов сервиса матрицы компетенции 
// Название сервиса: cm (competency matrix)
const   port = 3001,
		host = 'http://localhost:' + port + '/api/cm',
		requester = require('./requester');
// Токен сервисной авторизации + функция проверки
var checker = require('./../validators/token'), 
    token   = null;

module.exports = {
	// POST REQUEST
    CreateKn : function(data, callback) {
		let main = function(data, callback) {
			// kns = knowledges
			const uri = host + '/kns/create';
			const opt = requester.Options(uri, "POST", token);
			requester.HttpPost(opt, data, function(err, status, res) {
				token = checker(status, res, data, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(data, callback);
	},
	CreateWork : function(data, callback) {
		let main = function(data, callback) {
			const uri = host + '/works/create';
			const opt = requester.Options(uri, "POST", token);
			requester.HttpPost(opt, data, function(err, status, res) {
				token = checker(status, res, data, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(data, callback);
	},
	CreateHMark : function(data, callback) {
		let main = function(data, callback) {
			// HMark = mark holder
			const uri = host + '/users/create';
			const opt = requester.Options(uri, "POST", token);
			requester.HttpPost(opt, data, function(err, status, res) {
				token = checker(status, res, data, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(data, callback);
	},
	// PUT REQUEST
	UpdateKn : function(id, data, callback) {
		let scope = {
			id: id,
			data: data
		};
		let main = function(scope, callback) {
			const uri = host + '/kns/' + scope.id;
			const opt = requester.Options(uri, "PUT", token);
			requester.HttpPut(opt, scope.data, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	}, 
	UpdateWork : function(id, data, callback) {
		let scope = {
			id: id,
			data: data
		};
		let main = function(scope, callback) {
			const uri = host + '/works/' + scope.id;
			const opt = requester.Options(uri, "PUT", token);
			requester.HttpPut(opt, scope.data, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	},
	UpdateTask : function(id_work, id_task, data, callback) {
		let scope = {
			id_work: id_work,
			id_task: id_task,
			data: data
		};
		let main = function(scope, callback) {
			const uri = host + '/works/' + scope.id_work + '/tasks/' + scope.id_task;
			const opt = requester.Options(uri, "PUT", token);
			requester.HttpPut(opt, scope.data, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	},
	UpdateHMark : function(id, data, callback) {
		let scope = {
			id: id,
			data: data
		};
		let main = function(scope, callback) {
			const uri = host + '/users/' + id;
			const opt = requester.Options(uri, "PUT", token);
			requester.HttpPut(opt, scope.data, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	},
	// GET REQUEST
	GetKns : function(page, count, callback) {
		let scope = {
			page: page,
			count: count
		};
		let main = function(scope, callback) {
			const uri = host + '/kns?page=' + scope.page + '&count=' + scope.count;
			const opt = requester.Options(uri, "GET", token);
			requester.HttpGet(opt, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	},
	GetKnById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/kns/' + id;
			const opt = requester.Options(uri, "GET", token);
			requester.HttpGet(opt, function(err, status, res) {
				token = checker(status, res, id, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(id, callback);
	},
	GetWorks : function(page, count, callback) {
		let scope = {
			page: page,
			count: count
		};
		let main = function(scope, callback) {
			const uri = host + '/works?page=' + scope.page + '&count=' + scope.count;
			const opt = requester.Options(uri, "GET", token);
			requester.HttpGet(opt, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	},
	GetWorkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/works/' + id;
			const opt = requester.Options(uri, "GET", token);
			requester.HttpGet(opt, function(err, status, res) {
				token = checker(status, res, id, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(id, callback);
	},
	GetHMarks : function(page, count, callback) {
		let scope = {
			page: page,
			count: count
		};
		let main = function(scope, callback) {
			const uri = host + '/users?page=' + scope.page + '&count=' + scope.count;
			const opt = requester.Options(uri, "GET", token);
			requester.HttpGet(opt, function(err, status, res) {
				token = checker(status, res, scope, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(scope, callback);
	},
	GetHMarkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/users/' + id;
			const opt = requester.Options(uri, "GET", token);
			requester.HttpGet(opt, function(err, status, res) {
				token = checker(status, res, id, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(id, callback);
	},
	// DELETE REQUEST
	DeleteKn : function(callback) {
		let main = function(data = null, callback) {
			const uri = host + '/kns';
			const opt = requester.Options(uri, "DELETE", token);
			requester.HttpDelete(opt, function(err, status, res) {
				token = checker(status, res, data, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(callback);
	},
	DeleteKnById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/kns/' + id;
			const opt = requester.Options(uri, "DELETE", token);
			requester.HttpDelete(opt, function(err, status, res) {
				token = checker(status, res, id, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(id, callback);
	},
	DeleteWork : function(callback) {
		let main = function(data = null, callback) {
			const uri = host + '/works';
			const opt = requester.Options(uri, "DELETE", token);
			requester.HttpDelete(opt, function(err, status, res) {
				token = checker(status, res, data, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(callback);
	},
	DeleteWorkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/works/' + id;
			const opt = requester.Options(uri, "DELETE", token);
			requester.HttpDelete(opt, function(err, status, res) {
				token = checker(status, res, id, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(id, callback);
	},
	DeleteHMark : function(callback) {
		let main = function(data = null, callback) {
			const uri = host + '/users';
			const opt = requester.Options(uri, "DELETE", token);
			requester.HttpDelete(opt, function(err, status, res) {
				token = checker(status, res, data, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(callback);
	},
	DeleteHMarkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/users/' + id;
			const opt = requester.Options(uri, "DELETE", token);
			requester.HttpDelete(opt, function(err, status, res) {
				token = checker(status, res, id, main, token, callback);
                if (token !== null)
                    return callback(err, status, res);
                return;
			});
		}
		return main(id, callback);
	}
}