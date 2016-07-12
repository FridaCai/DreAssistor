var Util = {
	
	SEPERATOR: '___sep___',
    COLUMN_LABLE_MAP: {
	    'label': '名称',
	    'template.type': '豆豆类型',
	    'duration': '执行时间(小时)',
	    'template.param.bp.value': '背压(Kpa)',
	    'template.param.heavy.value': '重量(Kg)',
	    'template.param.snorkelNoiseXls': 'Snorkel Noise'
	},
	TAG_WIDTH: 50,
	TAG_COLOR: 255,
	
	getValue: function(obj, keys){
		var target = obj;
		var arr = keys.split('.');
		
		for(var i=0; i<arr.length; i++){
			var key = arr[i];
			target = target[key];
			if(!target){
				return undefined;
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
	}






}

module.exports = Util;