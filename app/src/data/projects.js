import Project from './project.js';
import Util from 'Util';

module.exports = class Projects extends Array{
	static create(param){
		var projects = new Projects();
		projects.init(param);
		return projects;
	}
	constructor(){
		super();
	}

	init(param){
		param && param.map((function(p){
			var project = new Project();
			project.init(p);
			//project.setParent(this); //need?
			this.push(Project.create(p));
		}).bind(this))
	}

	findProject(projectId){
		return this.find(function(project){
			return project.id === projectId;
		})
	}

	findTasks(condition){
		var tasks = [];
		this.map(function(p){
			p.findTasks(condition).map(function(task){
				tasks.push(task);
			});
		})
		return tasks;
	}

	dump(){
		return this.map(function(project){
			return project.dump();
		});
		
		//return JSON.stringify(obj); //will bring problem?
	}
	add(project){
		project.id = project.id || Util.generateUUID();
		this.unshift(project);
		//project.setParent(this); //need?
	}

	forEachProject(cb){
		return this.map(function(project){
			return cb(project);
		})
	}
	clear(){
		this.length = 0;
	}
}