import Signal from '../../signal.js';
import Task from './data/task.js';
import TemplateTasks from './data/templatetasks.js';
import Projects from './data/projects.js';
import Users from '../../data/users.js';
import {ExcelUtil} from 'XlsIExport';

var API = {
	signal_page_refresh: new Signal(),
	signal_timeline_task_create: new Signal(),
	signal_taskpopup_show: new Signal(),
	signal_projectpoup_show: new Signal(),
	
	_templateTasks: new TemplateTasks(),
	setTemplateTasks: function(value){
		this._templateTasks = new TemplateTasks();
		this._templateTasks.init(value);
	},
	getTemplateTasks: function(){
		return this._templateTasks;
	},
	getTemplateTaskArr: function(){
		return this._templateTasks.getArr();
	},



	_projects: new Projects(),
	setProjects: function(value){
		this._projects = new Projects();
		this._projects.init(value);
	},
	getProjects: function(){
		return this._projects;
	},
	getProjectArr: function(){
		return this._projects.getArr();
	},





	_templateEnum: undefined,
	setTemplateEnum:function(value){
		this._templateEnum = value;
	},
	getTemplateEnum: function(){
		return this._templateEnum;
	},



	//for statical assistor panel
	getStaticalProperties: function(tasks){
		var properties = [];
		
		tasks.map(function(task){
			task.statical.map(function(property){
				if(properties.indexOf(property) === -1){
					properties.push(property);
				}
			})
		})
		return properties;
	},


	//for user assistor panel
	_users:[],
	getUsers:function(){
		return this._users;
	},
	getUserArr: function(){
		return this._users.getArr();
	},
	setUsers:function(userobjs){
		this._users = new Users();
		this._users.init(userobjs);
	},
	findUserById: function(id){
		var user = this.getUserArr().find(function(user){
			return user.id === id;
		})
		return user;
	},


	//go through each project and return unduplicated users in the tasks of project
	findUsersHaveProject(){
		var userIds = [];
		this.getProjectArr().map(function(p){
			p.findTasks().map(function(t){
				var creatorId = t.creatorId;
				if(userIds.indexOf(creatorId) === -1){
					userIds.push(creatorId);
				}
			})
		});

		var users = userIds.map((function(id){
			var user = this.findUserById(id);
			return user;
		}).bind(this));
		return users;
	},
	

	/**
	filterTree: [{
		projectId: {
			subprojectId: {
				taskId: {empty},
				taskId: {}
			},
			subprojectId: {

			}
		}
	},{
	}]
	**/
	filterProjectsByUser:function(user){
		var filtered = {};
		var projects = API.getProjectArr();
		for(var i=0; i<projects.length; i++){
			var project = projects[i];
			var condition = user ? {key: 'creatorId', value: user.id}: user;
			if(!project.hasTask(condition)){
				continue;
			}

			filtered[project.id]={};

			var subprojects = project.children;
			for(var j=0; j<subprojects.length; j++){
				var subproject = subprojects[j];	
				
				if(!subproject.hasTask(condition)){
					continue;
				}

				filtered[project.id][subproject.id] = {};
				subproject.findTasks(condition).map(function(t){
					filtered[project.id][subproject.id][t.id] = {};
				})
			}
		}
		return filtered;
	},

	getTagTime: function(tag){
		var project = tag.parent.parent;

        var time = (function(sorp, week, adjustTime){
            var autoTime = ExcelUtil.getTimeBySorpWeek(sorp.time, week);
            return adjustTime || autoTime;
        }).call(this, project.sorp, tag.week, tag.time)

        return time;
	}
}

//need more sophisticate design.
window.dre = {
	data: API
}

module.exports = API;