import Signal from '../../signal.js';
import Task from './data/task.js';
import Tasks from './data/tasks.js';

var API = {
	signal_taskpopup_show: new Signal(),

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
	},


}


module.exports = API;