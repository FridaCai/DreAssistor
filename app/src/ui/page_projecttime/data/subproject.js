import Task from './task.js';

module.exports = class SubProject {
	constructor(){
		
	}

	init(param){
		this.id = param.id,
		this.name = param.name;
		this.creator = param.creator;
		this.tasks = param.tasks.map((taskObj) => {
			var task = new Task();
			task.init(taskObj);
			return task;
		})
	}
}