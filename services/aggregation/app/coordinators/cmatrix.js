// Обработки запросов сервиса матрицы компетенции 
// Название сервиса: cm (competency matrix)
const   port = 3001,
		host = 'http://localhost:' + port + '/api/cm',
		token = null,	// Токен сервисной авторизации
		valid = require('./../validators'),
        requester = require('./requester');

module.exports = {
	// POST REQUEST
    CreateKn : function(data, callback) {
		let main = function(data, callback) {
			// kns = knowledges
			const uri = host + '/kns/create';
			const opt = requester.Options(uri, "POST");
			requester.HttpPost(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function (err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(data, callback);
	},
	CreateWork : function(data, callback) {
		let main = function(data, callback) {
			const uri = host + '/works/create';
			const opt = requester.Options(uri, "POST");
			requester.HttpPost(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function (err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(data, callback);
	},
	CreateHMark : function(data, callback) {
		let main = function(data, callback) {
			// HMark = mark holder
			const uri = host + '/users/create';
			const opt = requester.Options(uri, "POST");
			requester.HttpPost(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function (err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(data, callback);
	},
	// PUT REQUEST
	UpdateKn : function(id, data, callback) {
		let main = function(id, data, callback) {
			const uri = host + '/kns/' + id;
			const opt = requester.Options(uri, "PUT");
			requester.HttpPut(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, data, callback);
	}, 
	UpdateWork : function(id, data, callback) {
		let main = function(id, data, callback) {
			const uri = host + '/works/' + id;
			const opt = requester.Options(uri, "PUT");
			requester.HttpPut(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, data, callback);
	},
	UpdateTask : function(id_work, id_task, data, callback) {
		let main = function(id_work, id_task, data, callback) {
			const uri = host + '/works/' + id_work + '/tasks/' + id_task;
			const opt = requester.Options(uri, "PUT");
			requester.HttpPut(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id_work, id_task, data, callback);
	},
	UpdateHMark : function(id, data, callback) {
		let main = function(id, data, callback) {
			const uri = host + '/users/' + id;
			const opt = requester.Options(uri, "PUT");
			requester.HttpPut(opt, data, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, data, callback);
	},
	// GET REQUEST
	GetKns : function(page, count, callback) {
		let main = function(page, count, callback) {
			const uri = host + '/kns?page=' + page + '&count=' + count;
			const opt = requester.Options(uri, "GET");
			requester.HttpGet(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(page, count, callback);
	},
	GetKnById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/kns/' + id;
			const opt = requester.Options(uri, "GET");
			requester.HttpGet(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, callback);
	},
	GetWorks : function(page, count, callback) {
		let main = function(page, count, callback) {
			const uri = host + '/works?page=' + page + '&count=' + count;
			const opt = requester.Options(uri, "GET");
			requester.HttpGet(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(page, count, callback);
	},
	GetWorkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/works/' + id;
			const opt = requester.Options(uri, "GET");
			requester.HttpGet(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, callback);
	},
	GetHMarks : function(page, count, callback) {
		let main = function(page, count, callback) {
			const uri = host + '/users?page=' + page + '&count=' + count;
			const opt = requester.Options(uri, "GET");
			requester.HttpGet(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(page, count, callback);
	},
	GetHMarkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/users/' + id;
			const opt = requester.Options(uri, "GET");
			requester.HttpGet(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, callback);
	},
	// DELETE REQUEST
	DeleteKn : function(callback) {
		let main = function(callback) {
			const uri = host + '/kns';
			const opt = requester.Options(uri, "DELETE");
			requester.HttpDelete(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(callback);
	},
	DeleteKnById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/kns/' + id;
			const opt = requester.Options(uri, "DELETE");
			requester.HttpDelete(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, callback);
	},
	DeleteWork : function(callback) {
		let main = function(callback) {
			const uri = host + '/works';
			const opt = requester.Options(uri, "DELETE");
			requester.HttpDelete(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(callback);
	},
	DeleteWorkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/works/' + id;
			const opt = requester.Options(uri, "DELETE");
			requester.HttpDelete(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, callback);
	},
	DeleteHMark : function(callback) {
		let main = function(callback) {
			const uri = host + '/users';
			const opt = requester.Options(uri, "DELETE");
			requester.HttpDelete(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(callback);
	},
	DeleteHMarkById : function(id, callback) {
		let main = function(id, callback) {
			const uri = host + '/users/' + id;
			const opt = requester.Options(uri, "DELETE");
			requester.HttpDelete(opt, function(err, status, res) {
				return requester.Response(err, status, res, function(err, status, res) {
					if (valid.ServiceToken(status, res, main, token, data, callback))
						return callback(err, status, res);
					return;
				});
			});
		}
		return main(id, callback);
	}
}