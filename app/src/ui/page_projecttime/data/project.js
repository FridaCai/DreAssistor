import SubProject from './subproject.js';
import Task from './task.js';

module.exports = class Project {
	constructor(){
		
	}

	init(param){
		this.projectId = param.projectId;
		this.mobileYearId = param.mobileYearId;
		this.name = param.name;
		this.children = param.children.map((subprojectObj) => {
			var subproject = new SubProject();
			subproject.init(subprojectObj);
			return subproject;
		});
		this.tasks = param.tasks.map((taskObj) => {
			var task = new Task();
			task.init(taskObj);
			return task;
		});
		this.creator = "";
	}
}