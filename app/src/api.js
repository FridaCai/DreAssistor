import Signal from './signal.js';
import Person from './data/person.js';

var API = {
	signal_page_refresh: new Signal(),
	signal_registerpopup_show: new Signal(),
	sigal_loginHeader_update: new Signal(),

	PAGE_NAMES: {
		PROJECT_TIME: 'PROJECT_TIME',
		PROJECT_ASSET: 'PROJECT_ASSET',
		PROJECT_PRO_MGR: 'PROJECT_PRO_MGR',
	},
	pageName: 'PROJECT_TIME',


	

	_loginUser: undefined,
	setLoginUser: function(value){
		this._loginUser = new Person();
		this._loginUser.init(value);
	},
	resetLoginUser: function(){
		this._loginUser = undefined;
	},
	getLoginUser: function() {
		return this._loginUser;
	},
	isLogin: function(){
		return this._loginUser ? true: false;
	}

}


module.exports = API;