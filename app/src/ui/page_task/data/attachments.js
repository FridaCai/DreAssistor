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
		if(!param)
			return;
		param.map((function(a){
			var attachment = Attachment.create(a);
			super.push(attachment);
		}).bind(this))
	}

	dump(){

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


class Attachment{
	static create(param){
		var at = new Attachment();
		at.init(param);
		return at;
	}

	constructor(){

	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.url = param.url;
		this.parent = undefined;
	}

	
	setParent(parent){
		this.parent = parent;
	}

	dump(){
		return {
			id: this.id,
			label: this.label,
			url: this.url,
		}
	}
}