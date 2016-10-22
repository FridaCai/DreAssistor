import Attachment from './attachment.js';

module.exports = class Attachments extends Array{
	static create(param){
		var ats = new Attachments();
		ats.init(param);
		return ats;
	}

	constructor(){
		super();
	}

	init(param){
		param && param.map((function(a){
			var attachment = Attachment.create(a);
			super.push(attachment);
		}).bind(this))
	}

	/*
	dump attachment and save 2 server
	ignore fail/loading one.
	*/
	dump(){
		var returnArr = [];
		super.map(function(at){
			if(at.status === 1){
				returnArr.push(at.dump());
			}
		})
		return returnArr;
	}
	
	add(at){
		super.unshift(at);
	}
	deleteById(id){
		var index = -1;
		for(var i=0; i<this.length; i++){
			var at = this[i];
			if(at.id === id){
				index = i;
				break;
			}
		}
		this.splice(index, 1);
	}
}
