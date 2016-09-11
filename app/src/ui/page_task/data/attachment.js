import Util from 'Util';

module.exports = class Attachment{
	static create(param){
		var at = new Attachment();
		at.init(param);
		return at;
	}

	constructor(){

	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.label = param.label;
		this.url = param.url;
		this.parent = undefined;
	}

	
	setParent(parent){
		this.parent = parent;
	}

	dump(){
		return {
			id: Util.isUUID(this.id) ? undefined: this.id,
			label: this.label,
			url: this.url,
		}
		
	}
}