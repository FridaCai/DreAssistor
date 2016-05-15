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
		

		//creator and people should be 'id' or person object? 
		//I choose the previous.
		//if the latter, make sure people list is loaded before and import API in project datamodel, it does not make sense.
		this.creatorId = param.creatorId;
		this.peopleIds = param.peopleIds;
	}

	addChild(subproject){
		this.children.unshift(subproject);
		subproject.setParent(this);
	}

	deleteChild(subproject){
		this.children = this.children.filter(function(_supproject) {
			return !(subproject.id === _supproject.id);
		})
	}
}