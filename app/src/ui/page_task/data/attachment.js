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
		this.label = param.label; //source file name;
		this.parent = param.parent;
		this.guid = param.guid;
		this.status = param.status; //0--loading; 1--complete; 2--fail
		this.progress = param.progress; //0-100
	}

	setParent(parent){
		this.parent = parent;
	}
	update(param){
		this.guid = param.guid || undefined;
		this.status = param.status || 0;
		this.progress = param.progress || 0;
	}
	dump(){
		return {
			id: Util.isUUID(this.id) ? undefined: this.id,
			label: this.label,
			guid: this.guid
		}
		
	}
}