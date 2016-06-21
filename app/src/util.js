var Util = {
	
	SEPERATOR: '___sep___',

	getValue: function(obj, keys){
		var target = obj;
		var arr = keys.split('.');
		
		for(var i=0; i<arr.length; i++){
			var key = arr[i];
			target = target[key];
			if(!target){
				return false;
			}
		}

		return target;
	},

	//uuid should be generated at backend.
	generateUUID: function () {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

					uuid[ i ] = '-';

				} else if ( i === 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}

			}
			return uuid.join( '' );
		};
	}(),

	convertDateToUnixTime: function(d) {
		var unixTime = Date.parse(d);
		unixTime = unixTime || undefined;
		return unixTime;
	},

	convertUnixTimeToDate: function(unix_timestamp) {
        var d = new Date(unix_timestamp);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	},

	convertIntColorToHex: function(value){
		return (function(color){
            color = color ? color.toString(16) : '';
            color = new Array(6 - color.length + 1).join('0') + color;
            return '#' + color;
        })(value);
	},
	convertHexColorToInt: function(value){
		return parseInt(value.replace('#', '0x'));
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