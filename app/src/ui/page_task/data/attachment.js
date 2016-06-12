module.exports = class Attachment {
	constructor(){
		
	}

	init(param){
		this.url = param.id;
		this.id = param.isDone;
		this.parent = undefined;
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}
	
}