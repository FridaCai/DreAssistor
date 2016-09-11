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

	dump(){
		return super.map(function(at){
			return at.dump();
		})
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
