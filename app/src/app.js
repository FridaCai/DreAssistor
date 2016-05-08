import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './ui/mainview.js';
import API from './api.js';

if(Promise != undefined){
	window.Promise = require('es6-promise').Promise;
}


(function() {
	var isLogin = API.isLogin();
	ReactDOM.render(<MainView isLogin = {isLogin}/>, $("#domContainer")[0]);
})();


