var Util = {
	convertDateToUnixTime: function(d) {
		var unixTime = Date.parse(d);
		unixTime = unixTime || undefined;
		return unixTime;
	},

	convertUnixTimeToDate: function(unix_timestamp) {
        var d = new Date(unix_timestamp);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	},

	getData: function(url, options) {
	    if (!url) return;
	    options = options || {};
	    options.dataType = options.dataType || 'json';
	
	    return new Promise(function(resolve, reject) {
	        var params = {
	            url: url,
	            type: 'GET',
	            success: resolve,
	            error: reject
	        };
	        $.extend(params, options);
	        $.ajax(params);
	    });
	},

	postData: function(url, data, options) {
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
}

module.exports = Util;