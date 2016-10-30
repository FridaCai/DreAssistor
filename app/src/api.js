import Signal from 'Signal';
import User from './data/user.js';
import Request from 'Request';
import TemplateTasks from 'ui/page_task/data/templatetasks.js'; //todo

var API = {
	signal_page_navigate: new Signal(),
	signal_registerpopup_show: new Signal(),
	signal_login: new Signal(),
	signal_logout: new Signal(),
	signal_login_timeout: new Signal(), //find login timeout when verify auth;
	sigal_window_resizeend: new Signal(),
	signal_server_fail: new Signal(),
	

	_templateTasks: new TemplateTasks(),
	setTemplateTasks: function(value){
		this._templateTasks = new TemplateTasks();
		this._templateTasks.init(value);
	},
	getTemplateTasks: function(){
		return this._templateTasks;
	},

	findTemplateByType: function(type){
		return this._templateTasks.findById(type);
	},
	getAllTemplateTaskTypes: function(){
		return this._templateTasks.map(function(templatetask){
			return {
				id: templatetask.template.type,
				label: templatetask.label,
			}
		})
	},
	_templateEnum: undefined,
	setTemplateEnum:function(value){
		this._templateEnum = value;
	},
	getTemplateEnum: function(){
		return this._templateEnum;
	},



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

	_getLoginUser: function(){
		var token = this.getToken();
		if(!token){
			return Promise.reject({
				errCode: 7
			});
		}

		$.ajaxSetup({
			headers: {
			  'x-access-token': this.getToken()
			}
		});

		return Request.getData(Request.getBackendAPI('authTest')).then((function(res){
			if(res.errCode!=-1){
				return Promise.reject(res);			
			}else{
				return Promise.resolve(res.user);
			}
		}).bind(this));	
	},
	clientAuthVerify: function(ownerId){
		return this._clientAuthVerify(ownerId);
	},
	_clientAuthVerify: function(ownerId){
		var loginUser = this.getLoginUser();
		return (loginUser && (ownerId === loginUser.id))
	},

	authVerify: function(ownerId){
		return this._getLoginUser().then((function(){
		  	if(this._clientAuthVerify(ownerId)){
				return Promise.resolve();
    		}
			throw new Error('unknown error');	
    	}).bind(this), (function(res){
			if(res.errCode===8){
                this.signal_login_timeout.dispatch();
                return Promise.reject();
            }
            throw new Error(JSON.stringify(res, '', 2));
    	}).bind(this)).catch(function(e){
			console.error(e.stack);
			this.signal_server_fail.dispatch();
    	});
	},

	updateLoginUser: function(){
		this.resetLoginUser();
		return this._getLoginUser().then((function(user){
			this.setLoginUser(user);
		}).bind(this), (function(){
			this.removeToken();
		}).bind(this));
	}
}


module.exports = API;