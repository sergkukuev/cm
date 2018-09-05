// Обработки запросов сервиса авторизации
// Название сервиса: auth
const   port = 3005,
        host = 'http://localhost:' + port + '/auth',
        token = null,   // Токен сервисной авторизации
        valid = require('./../validators'),
        requester = require('./requester');

module.exports = {
    // POST REQUEST
    GetTokenByPass : function(scope, callback) {
        let main = function(scope, callback) {
            const uri = host + '/token';
            const opt = requester.Options(uri, "POST", token);
            const data = {
                grant_type: 'password',
                login: scope.login,
                password: scope.password
            };
            requester.HttpPost(opt, data, function(err, status, res) {
                return requester.Response(err, status, res, function (err, status, res) {
                    if (valid.ServiceToken(status, res, main, token, data, callback))
                        return callback(err, status, res);
                    return;
                });
            });
        }
        return main(scope, callback);
    },
    GetTokenByCode : function(scope, callback) {
        let main = function(scope, callback) {
            const uri = host + '/token';
            const opt = requester.Options(uri, "POST", token);
            const data = {
                grant_type: 'authorization_code',
                code: scope.code
            };
            requester.HttpPost(opt, data, function(err, status, res) {
                return requester.Response(err, status, res, function (err, status, res) {
                    if (valid.ServiceToken(status, res, main, token, data, callback))
                        return callback(err, status, res);
                    return;
                });
            });
        }
        return main(scope, callback);
    },
    GetTokenByToken : function(scope, callback) {
        let main = function(scope, callback) {
            const uri = host + '/token';
            const opt = requester.Options(uri, "POST", token);
            const data = {
                grant_type: 'refresh_token',
                refresh_token: scope.ref_token
            };
            requester.HttpPost(opt, data, function(err, status, res) {
                return requester.Response(err, status, res, function (err, status, res) {
                    if (valid.ServiceToken(status, res, main, token, data, callback))
                        return callback(err, status, res);
                    return;
                });
            });
        }
        return main(scope, callback);
    },
    // GET REQUEST
    GetUserInfo : function(scope, callback) {
        let main = function (scope, callback) {
            const uri = host + '/userId';
            const opt = requester.Options(uri, "GET", token, scope.token);
            requester.HttpGet(opt, function(err, status, response) {
                return requester.Response(err, status, res, function (err, status, res) {
                    if (valid.ServiceToken(status, res, main, token, data, callback))
                        return callback(err, status, res);
                    return;
                });
            });
        }
        return main(scope, callback);
    }
}