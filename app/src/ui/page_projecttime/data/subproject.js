import Task from './task.js';

module.exports = class SubProject {
	constructor(){
		
	}

	init(param){
		this.id = param.id;
		this.name = param.name;

		this.tasks = param.tasks.map((taskObj) => {
			var task = new Task();
			task.init(taskObj);
			task.setParent(this); 
			return task;
		})

		this.isShow = true; //not property of subproject, but user preference.
		this.creatorId = param.creatorId;
		this.peopleIds = param.peopleIds;
	}

	toggleVisibility() {
		this.isShow = !this.isShow;
		
	}

	getParent(){
		return this.parent;
	}

	setParent(parent){
		this.parent = parent;
	}

	addTask(task){
		this.tasks.unshift(task);
		task.setParent(this);
	}
}