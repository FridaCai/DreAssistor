import Project from './project.js';

module.exports = class Projects{
	constructor(){
		this.arr = new Array();
	}

	init(projectsObj){
		projectsObj.forEach((function(projectObj){
			var project = new Project();
			project.init(projectObj);
			this.arr.push(project);
		}).bind(this));
	}

	batchAdd(newProjects){
		newProjects.forEach((function(project){
			this.arr.unshift(project);
		}).bind(this));
	}

	delete(projectId, mobileYearId){
		debugger; //work?
		this.arr = this.arr.filter((project) => {
			return !(project.projectId === projectId && project.mobileYearId === mobileYearId);
		});
	}
}