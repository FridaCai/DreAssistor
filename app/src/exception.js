'use strict';

var CError = class CError{
	constructor(key, addParam){
		this.key = key;
		this.addParam = addParam;
	}
}

var ENUM = {
		0: function(){
			return {
				code: 0,
				res: {
					msg: `name has been registered`
				}	
			}
		},
		1: function(){
			return {
				code: 1,
				res: {
					msg: `email has been registered`
				}	
			}
		},
		2: function(param){
			return {
				code: 2,
				res: {
					msg: `db error`
				},
				log:{
					msg: `db error when insert user. err: ${JSON.stringify(param)}`,
					level: 'error'
				}
			}
		},
		3: function(param){
			return {
				code: 3,
				res: {
					msg: `unknown error`
				},
				log:{
					msg: `unkown error. message: ${JSON.stringify(param)}`,
					level: 'error'
				}
			}
		},
		4: function(param){ 
			return {
				code: 4,
				res: {
					msg: `no user found in db when login`,
				},
				log: {
					msg: `no user found in db when login. message: ${param}`,
					level: 'info',
				}
			}
		},
		5: function(param){ 
			return {
				code: 5,
				log: {
					msg: `find duplicate user email in db which should not happened. message: ${param}`,
					level: 'error',
				}
			}
		},
		6: function(param){ 
			return {
				code: 6,
				res: {
					msg: `password wrong when login`,
				}
			}
		},
		7: function(){
			return {
				code: 7,
				res: {
					msg: `no user login`,
				}
			}
		},
		8: function(){
			return {
				code: 8,
				res: {
					msg: `user token timeout`,
				}
			}
		},
		9: function(){
			return {
				code: 4,
				res: {
					msg: `no user found in db after decode token`,
				}
			}
		},
		10: function(){
			return {
				code: 10,
				res: {
					msg: `no authorization`
				}
			}
		}
}


module.exports = {
	CError: CError,
	ENUM: ENUM,
}