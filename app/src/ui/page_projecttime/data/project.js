import SubProject from './subproject.js';
import Task from './task.js';

module.exports = class Project {
	constructor(){
		
	}

	init(param){
		this.projectId = param.projectId;
		this.mobileYearId = param.mobileYearId;
		this.name = param.name;
		
		this.children = param.children.map(((subprojectObj) => {
			var subproject = new SubProject();

			var param = Object.assign({parent: this}, subprojectObj);
			subproject.init(param);


			return subproject;
		}).bind(this));


		this.tasks = param.tasks.map((taskObj) => {
			var task = new Task();
			task.init(taskObj);
			return task;
		});
		this.creator = param.creator;
	}

	addChild(subproject){
		this.children.unshift(subproject);
	}

	deleteChild(subproject){
		this.children = this.children.filter(function(_supproject) {
			return !(subproject.id === _supproject.id);
		})
	}
}