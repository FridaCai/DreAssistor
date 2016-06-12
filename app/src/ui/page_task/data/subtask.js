module.exports = class SubTask {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.isDone = param.isDone;
		this.parent = undefined;
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}
	setIsDone(isDone){
		this.isDone = isDone;
	}
	setParent(parent){
		this.parent = parent;
	}
}