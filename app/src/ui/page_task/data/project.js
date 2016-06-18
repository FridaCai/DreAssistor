import SubProject from './subproject.js';



module.exports = class Project {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.creatorId=param.creatorId;
		this.sop = param.sop;
		this.ec = param.ec;
		this.bprange = param.bprange; //[min, max]
		
		this.children = [];
		param.children && param.children.map((function(sp){
			var subproject = new SubProject();
			subproject.init(sp);

			subproject.setParent(this);
			this.children.push(subproject);
		}).bind(this));
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}

	
	setParent(parent){
		this.parent = parent;
	}

}