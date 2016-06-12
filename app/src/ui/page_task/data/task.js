import SubTask from './subtask.js';

module.exports = class Task {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.label = param.label;
		this.startTime=param.startTime;
		this.endTime = param.endTime;
		this.desc = param.desc;
		this.markColor = param.markColor;
		this.attachedFiles = param.attachedFiles;
		this.creatorId = param.creatorId;
		this.priority = param.priority;
		
		this.subtasks = [];
		param.subtasks.map((function(subtask){
			var st = new SubTask();
			st.init(subtask);
			st.setParent(this);
			this.subtasks.push(st);
		}).bind(this));

		this.privacy = param.privacy;
		this.template = param.template;
		this.parent = undefined;
	}
	update(param){
		//might have problem for array copy. 
		//$.extend(true, [], templateList);
		Object.assign(this, param); 
	}

	findSubTask(id){
		return this.subtasks.find(function(subtask){
			return subtask.id === id;
		})
	}
	
	deleteSubTask(id){
		this.subtasks = this.subtasks.filter(function(subtask){
			return !(id === subtask.id);
		})
	}
	addSubTask(subtask){
		this.subtasks.unshift(subtask);
		subtask.setParent(this);
	}
	setParent(parent){
		this.parent = parent;
	}
}