module.exports = class Attachment {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.url = param.url;
		this.parent = undefined;
	}
	
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
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