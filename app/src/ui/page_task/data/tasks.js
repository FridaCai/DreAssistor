import Task from './task.js';

module.exports = class Tasks extends Array{
	static create(param){
		var tasks = new Tasks();
		tasks.init(param);
		return tasks;
	}

	constructor(){
		super();
	}

	init(param){
		param.map((function(task){
			var t = Task.create(task);
			t.setParent(this);
			this.push(t);
		}).bind(this))
	}

/*
	find(taskId){
		return this.arr.find(function(task){
			return task.id === taskId;
		})
	}
	*/
	getChildren(handler){
		this.sort(handler);
		return this;
	}
	setParent(parent){
		this.parent = parent;
	}
	addChild(task){
		this.unshift(task);
		task.setParent(this);
	}
	clearChildren(){
		this.length = 0;
	}
	dump(){
		return this.map(function(task){
			return task.dump();
		})
	}

}