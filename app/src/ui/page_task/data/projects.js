import Project from './project.js';
import Util from 'Util';

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

	findTasks(condition){
		var tasks = [];
		this.arr.map(function(p){
			tasks = tasks.concat(p.findTasks(condition));
		})
		return tasks;
	}

	dump(){
		var obj = [];

		this.arr.map(function(project){
			obj.push(project.dump());
		});
		
		return JSON.stringify(obj);
	}
	add(project){
		project.id = project.id || Util.generateUUID();
		this.arr.unshift(project);
		project.setParent(this);
	}
}