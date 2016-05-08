import Util from '../../util.js';
import Signal from '../../signal.js';

var API = {
	signal_appProjectPopup_show: new Signal(),
	
	getData: function() {
		return Util.getData('res/mockupapi/getdata.json');
	}

}

module.exports = API;