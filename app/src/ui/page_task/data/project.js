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

	findChildByIndex(index){
		return this.children[index];
	}

	findTasks(condition){
		var tasks = [];
		this.children.map(function(sp){
			tasks = tasks.concat(sp.findTasks(condition));
		})
		return tasks;
	}

	dump(){
		var children = [];
		this.children.map(function(child){
			children.push(child.dump());
		});

		return {
			id: this.id,
			label: this.label,
			creatorId: this.creatorId,
			sop: this.sop,
			ec: this.ec,
			bprange: {
				min: this.bprange.min,
				max: this.bprange.max
			},
			children: children
		};
	}
}