// Обработки запросов сервиса авторизации
// Название сервиса: auth
const   port = 3005,
        host = 'http://localhost:' + port + '/auth',
        valid = require('./../validators'),
        requester = require('./requester');
var     token = null;   // Токен сервисной авторизации

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
                    token = valid.ServiceToken(status, res, main, token, data, callback);
                    if (token !== null)
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
                    token = valid.ServiceToken(status, res, main, token, data, callback);
                    if (token !== null)
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
                refresh_token: scope.refresh_token
            };
            requester.HttpPost(opt, data, function(err, status, res) {
                return requester.Response(err, status, res, function (err, status, res) {
                    token = valid.ServiceToken(status, res, main, token, data, callback);
                    if (token !== null)
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
            const uri = host + '/user/id';
            const opt = requester.Options(uri, "GET", token, scope.token);
            requester.HttpGet(opt, function(err, status, response) {
                return requester.Response(err, status, res, function (err, status, res) {
                    token = valid.ServiceToken(status, res, main, token, scope, callback);
                    if (token !== null)
                        return callback(err, status, res);
                    return;
                });
            });
        }
        return main(scope, callback);
    }
}