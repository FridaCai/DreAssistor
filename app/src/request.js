import SystemConfig from './config/system';
var env = SystemConfig.backendAPI;

var getBackendAPI = function(url){
	return env + url;
}

var getMockupAPI = function(url){
	var prefix = '/app/res/mockupapi/';
	return prefix + url;
}

var getData = function(url, data, options) {
    options = options || {};
    options.dataType = options.dataType || 'json';

    return new Promise(function(resolve, reject) {
        var params = {
            url: url,
            type: 'GET',
            data: data,
            success: resolve,
            error: reject
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
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if (options.uploadProgress) {
                    xhr.upload.addEventListener('progress', options.uploadProgress, false);
                }
                return xhr;
            },
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
}
