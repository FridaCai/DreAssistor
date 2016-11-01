import SystemConfig from './config/system';
import Signal from 'Signal';

var env = SystemConfig.backendAPI;

var getBackendAPI = function(url){
	return env + url;
}

var getMockupAPI = function(url){
	var prefix = '/app/res/mockupapi/';
	return prefix + url;
}


//to notify common ui: show progress bar, hide progress bar, alert error.
var signal_request_send = new Signal();
var signal_response_receive = new Signal();
var signal_response_fail = new Signal();

var getData = function(url, data, options) {
    options = options || {};
    options.dataType = options.dataType || 'json';

    this.signal_request_send.dispatch();
    return new Promise(function(resolve, reject) {
        var params = {
            url: url,
            type: 'GET',
            data: data,
            success: function(res){
                if(res.errCode == -1){
                    resolve(res);    
                    signal_response_receive.dispatch();
                }else{
                    reject(new Error(res.errMsg));
                    signal_response_fail.dispatch();
                }
            },
            error: function(e){
                reject(e);
                signal_response_fail.dispatch();
            }
        };
        $.extend(params, options);
        $.ajax(params);
    });
}

var postData = function(url, data, options) {
    options = options || {};
    var dataString = JSON.stringify(data);
    if (options.contentType === 'application/x-www-form-urlencoded; charset=UTF-8'
        || options.contentType === false) {
        dataString = data;
    }

    var jqxhr;
    var promise = new Promise(function(resolve, reject) {
        var params = {
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: dataString,
            dataType: 'json',
            success: resolve,
            error: reject,
        };
        $.extend(params, options);
        jqxhr = $.ajax(params);
    });

    promise.abort = function() {
      jqxhr.abort();
    };
    return promise;
}

var putData = function(url, data, options) {
    options = options || {};
    var dataString = JSON.stringify(data);
    return new Promise(function(resolve, reject) {
        var params = {
            url: url,
            type: 'PUT',
            contentType: 'application/json',
            data: dataString,
            dataType: 'json',
            success: resolve,
            error: reject
        };
        $.extend(params, options);
        $.ajax(params);
    });
};
var deleteData = function(url, options) {
    options = options || {};
    return new Promise(function(resolve, reject) {
        var params = {
            url: url,
            type: 'DELETE',
            success: resolve,
            error: reject
        };
        $.extend(params, options);
        $.ajax(params);
    });
};

module.exports = {
	postData: postData,
	getData: getData,
    putData: putData,
    deleteData: deleteData,
	getBackendAPI: getBackendAPI,
	getMockupAPI: getMockupAPI,
    signal_request_send: signal_request_send,
    signal_response_receive: signal_response_receive,
    signal_response_fail: signal_response_fail
}
