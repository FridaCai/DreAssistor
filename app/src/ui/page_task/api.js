import Signal from '../../signal.js';
import Task from './data/task.js';
import Tasks from './data/tasks.js';

var API = {
	signal_page_refresh: new Signal(),
	signal_taskpopup_show: new Signal(),
	signal_timeline_task_create: new Signal(),

	
	_templateTasks: new Tasks(),
	setTemplateTasks: function(value){
		this._templateTasks = new Tasks();
		this._templateTasks.init(value);
	},
	getTemplateTasks: function(){
		return this._templateTasks;
	},
	getTemplateTaskArr: function(){
		return this._templateTasks.getArr();
	},






	_tasks: new Tasks(),
	setTasks: function(value){
		this._tasks = new Tasks();
		this._tasks.init(value);
	},
	getTasks: function(){
		return this._tasks;
	},
	getTaskArr: function(){
		return this._tasks.getArr();
	}

}

//need more sophisticate design.
window.dre = {
	data: {
		tasks: API,
	}
}

module.exports = API;