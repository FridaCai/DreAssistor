import Project from './project.js';

module.exports = class Projects {
	constructor(){
		this.arr = new Array();
	}

	init(param){
		param.map((function(p){
			var project = new Project();
			project.init(p);
			project.setParent(this);
			this.arr.push(project);
		}).bind(this))
	}

	getArr(){
		return this.arr;
	}

	find(projectId){
		return this.arr.find(function(project){
			return project.id === projectId;
		})
	}
}