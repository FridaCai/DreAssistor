import User from './user.js';

module.exports = class Users {
	constructor(){
		this.arr = new Array();
	}

	init(param){
		param.map((function(p){
			var user = new User();
			user.init(p);
			this.arr.push(user);
		}).bind(this))
	}

	getArr(){
		return this.arr;
	}


	
	dump(){
		var obj = [];

		this.arr.map(function(project){
			obj.push(project.dump());
		});
		
		return JSON.stringify(obj);
	}
}