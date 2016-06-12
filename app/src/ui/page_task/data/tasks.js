import Task from './task.js';

module.exports = class Tasks {
	constructor(){
		this.arr = new Array();
	}

	init(param){
		param.map((function(task){
			var t = new Task();
			t.init(task);
			t.setParent(this);
			this.arr.push(t);
		}).bind(this))
	}

	getArr(){
		return this.arr;
	}

	find(taskId){
		return this.arr.find(function(task){
			return task.id === taskId;
		})
	}
	addTask(task){
		this.arr.unshift(task);
	}
}