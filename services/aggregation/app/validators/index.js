module.exports = {
    checkService : function(status, res, method, service, token, info, callback) {
        if (status == 401 && res.statusText == 'Unauthorized') {
            log.info(service + 'token not topical.');
            delete token;
            token = null;
            method(info, callback);
            return true;
        } else if (typeof(res.service) != 'undefined') {
            log.info('Set new ' + service + 'token');
            token = response.service;
            delete response.service;
        }
        return false;
    }
}