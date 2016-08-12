module.exports = class Attachments {
	static create(param){
		var ats = new Attachments();
		ats.init(param);
		return ats;
	}

	constructor(){
		this.arr = new Array();
	}

	init(param){
		param && param.map((function(a){
			var attachment = Attachmnent.create(a);
			this.arr.push(attachment);
		}).bind(this))
	}

	dump(){

	}
	add(at){
		this.arr.unshift(at);
	}
	deleteById(id){
    	this.arr = this.arr.filter(function(at){
    		return !(id === at.id);
    	})
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