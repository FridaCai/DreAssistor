import Signal from 'Signal';
import User from './data/user.js';
import Request from 'Request';

//import Signal from './signal.js';
//import Request from './request.js';

var API = {
	signal_page_navigate: new Signal(),
	signal_registerpopup_show: new Signal(),
	sigal_loginHeader_update: new Signal(),
	sigal_window_resizeend: new Signal(),




	pageMap: {
		home: {
			label: '首页',
		},
		task: {
			label: '待办事项',
		},
		hotissue: {
			label: 'HotIssue',
		}
	},

	curpage: 'home',





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
	isLogin: function(){
		return this._loginUser ? true: false;
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
				return;
			}

			if(!this.getToken()){
				resolve();
				return;
			}

			$.ajaxSetup({
				headers: {
				  'x-access-token': this.getToken()
				}
			});
			Request.getData(Request.getBackendAPI('authTest')).then((function(res){
				if(res.errCode!=-1){
					this.removeToken();
					resolve();					
					return;
				}

				this.setLoginUser(res.user);
				resolve();
				return;

			}).bind(this));	
		}).bind(this))
	}

}


module.exports = API;