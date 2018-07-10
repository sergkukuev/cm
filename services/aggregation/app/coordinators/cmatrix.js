// Обработки запросов сервиса матрицы компетенции 
// Название сервиса: cm (competency matrix)
const   port = 3001,
        host = 'http://localhost:' + port + '/api/cm',
        requester = require('./requester');

module.exports = {
	// POST REQUEST
    CreateKn : function(data, callback) {
        // kns = knowledges
        const uri = host + '/kns/create';
        const opt = requester.Options(uri, "POST");
        requester.HttpPost(opt, data, function(err, status, res) {
        	return requester.Response(err, status, res, callback);
        });
	},
	CreateWork : function(data, callback) {
		const uri = host + '/works/create';
		const opt = requester.Options(uri, "POST");
        requester.HttpPost(opt, data, function(err, status, res) {
        	return requester.Response(err, status, res, callback);
        });
	},
	CreateHMark : function(data, callback) {
		// HMark = mark holder
		const uri = host + '/marks/create';
		const opt = requester.Options(uri, "POST");
        requester.HttpPost(opt, data, function(err, status, res) {
        	return requester.Response(err, status, res, callback);
        });
	},
	// PUT REQUEST
	UpdateKn : function(id, data, callback) {
		const uri = host + '/kns/' + id;
		const opt = requester.Options(uri, "PUT");
		requester.HttpPut(opt, data, function(err, status, res) {
        	return requester.Response(err, status, res, callback);
        });
	}, 
	UpdateWork : function(id, data, callback) {
		const uri = host + '/works/' + id;
		const opt = requester.Options(uri, "PUT");
		requester.HttpPut(opt, data, function(err, status, res) {
        	return requester.Response(err, status, res, callback);
        });
	},
	UpdateHMark : function(id, data, callback) {
		const uri = host + '/marks/' + id;
		const opt = requester.Options(uri, "PUT");
		requester.HttpPut(opt, data, function(err, status, res) {
        	return requester.Response(err, status, res, callback);
        }); 
	},
	// GET REQUEST
	GetKns : function(page, count, callback) {
		const uri = host + '/kns?page=' + page + '&count=' + count;
		const opt = requester.Options(uri, "GET");
		requester.HttpGet(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	GetKnById : function(id, callback) {
		const uri = host + '/kns/' + id;
		const opt = requester.Options(uri, "GET");
		requester.HttpGet(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	GetWorks : function(page, count, callback) {
		const uri = host + '/works?page=' + page + '&count=' + count;
		const opt = requester.Options(uri, "GET");
		requester.HttpGet(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	GetWorkById : function(id, callback) {
		const uri = host + '/works/' + id;
		const opt = requester.Options(uri, "GET");
		requester.HttpGet(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	GetHMarks : function(page, count, callback) {
		const uri = host + '/marks?page=' + page + '&count=' + count;
		const opt = requester.Options(uri, "GET");
		requester.HttpGet(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	GetHMarkById : function(id, callback) {
		const uri = host + '/marks/' + id;
		const opt = requester.Options(uri, "GET");
		requester.HttpGet(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	// DELETE REQUEST
	DeleteKn : function(callback) {
		const uri = host + '/kns';
		const opt = requester.Options(uri, "DELETE");
		requester.HttpDelete(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	DeleteKnById : function(id, callback) {
		const uri = host + '/kns/' + id;
		const opt = requester.Options(uri, "DELETE");
		requester.HttpDelete(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	DeleteWork : function(callback) {
		const uri = host + '/works';
		const opt = requester.Options(uri, "DELETE");
		requester.HttpDelete(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	DeleteWorkById : function(id, callback) {
		const uri = host + '/works/' + id;
		const opt = requester.Options(uri, "DELETE");
		requester.HttpDelete(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	DeleteHMark : function(callback) {
		const uri = host + '/marks';
		const opt = requester.Options(uri, "DELETE");
		requester.HttpDelete(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
	DeleteHMarkById : function(id, callback) {
		const uri = host + '/marks/' + id;
		const opt = requester.Options(uri, "DELETE");
		requester.HttpDelete(opt, data, function(err, status, res) {
			return requester.Response(err, status, res, callback);
		});
	},
}