import Signal from './signal.js';
import User from './data/user.js';
import Request from './request.js';

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
	setLoginUser: function(userObj){
	    this._loginUser = new User();
        this._loginUser.init(userObj);
	},
	getLoginUser: function() {
		return this._loginUser;
	},
	resetLoginUser: function(){
		this._loginUser = undefined;
	},
	setToken:function(token){
		if(!token) return;

		window.localStorage.setItem('token', token);
		$.ajaxSetup({
			headers: {
			  'x-access-token': token
			}
		});
	},

	getToken:function(){
		return window.localStorage.getItem('token');
	},

	//when token has expired or invalide, remove token.
	removeToken: function(){
		window.localStorage.removeItem('token');
		$.ajaxSetup({
			headers: {
			  'x-access-token': undefined
			}
		});
	},

	initLoginStatus: function(){
		return new Promise((function(resolve, reject){
			if(this._loginUser){
				resolve();
			}

			if(!this.getToken())
				resolve();

			$.ajaxSetup({
				headers: {
				  'x-access-token': this.getToken()
				}
			});
			Request.getData(Request.getBackendAPI('authTest')).then((function(res){
				if(res.errCode!=-1){
					this.removeToken();
					resolve();					
				}

				this.setLoginUser(res.user);
				resolve();

			}).bind(this));	
		}).bind(this))
	}

}


module.exports = API;