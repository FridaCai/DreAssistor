import Util from '../../util.js';

var API = {
	getData: function() {
		return Util.getData('res/mockupapi/getdata.json');
	}

}

module.exports = API;