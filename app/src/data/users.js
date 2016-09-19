import User from './user.js';

module.exports = class Users extends Array{
	constructor(){
		super();
	}

	init(param){
		param.map((function(p){
			this.push(User.create(p));
		}).bind(this))
	}
	
	dump(){
		return this.map(function(user){
			return user.dump();
		})
	}
}