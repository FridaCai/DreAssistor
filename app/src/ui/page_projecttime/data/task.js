module.exports = class Task {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.name = param.name;
		this.startTime=param.startTime;
		this.endTime = param.endTime;
		this.desc = param.desc;
		this.markColor = param.markColor;
		this.attachedFiles = param.attachedFiles;
		this.creatorId = param.creatorId;
		this.peopleIds = param.peopleIds;
		this.priority = param.priority;
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}

	setParent(parent) {
		this.parent = parent;
	}

	getParent() {
		return this.parent;
	}
}