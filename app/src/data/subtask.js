import Util from 'Util';
module.exports = class Subtask {
	static create(param){
		var st = new Subtask();
		st.init(param);
		return st;
	}
	constructor(){
		
	}

	init(param){
		this.id = param.id  || Util.generateUUID();
		this.label = param.label;
		this.status = param.status;
		this.parent = undefined;
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}
	setIsDone(status){
		this.status = status;
	}
	setParent(parent){
		this.parent = parent;
	}
	dump(){
		return {
			id: Util.isUUID(this.id) ? undefined: this.id,
			label: this.label,
			status: this.status
		}
	}
}