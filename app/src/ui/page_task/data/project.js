import SubProject from './subproject.js';
import Util from '../../../util.js';


module.exports = class Project {
	constructor(){
		
	}

	init(param){
		this.id = param.id || Util.generateUUID();
		this.label = param.label;
		this.creatorId=param.creatorId;
		
		this.ec = param.ec;
		
		this.bpmin = param.bpmin;
		this.bpmax = param.bpmax;


		this.sorp = param.sorp; //need or not? need to discuss on meeting.
		
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
	hasTask(condition){
		return this.findTasks(condition).length === 0 ? false: true;
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
			sorp: this.sorp,
			ec: this.ec,
			bpmin: this.bpmin,
			bpmax: this.bpmax,
			children: children
		};
	}
}