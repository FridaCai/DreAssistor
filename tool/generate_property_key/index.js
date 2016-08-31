//# read in src file.
//# generate property value according to key.
//# write file.

var fs = require('fs');
var propertyKey = require('./property_key.js');
var pathname = './tool/generate_property_key/property_key.js'; 

var path = [];
var target = {};
var goThrough = function(root){
	Object.keys(root).map(function(key){
		path.push(key);

		var value = root[key];
		if(typeof value === 'object'){
			goThrough(value);
		}else if(typeof value === 'string'){
			root[key] = path.join('.');
		}
		path.pop();
	})
}

goThrough(propertyKey);
//console.log('============================== done ==============================');
//console.log(propertyKey);


//why task property is not correct?
//write file
//file position: app/res/...



var desPath = './app/res/config/property_key.json';
fs.writeFile(desPath, JSON.stringify(propertyKey, '',2), function(err, data){});
