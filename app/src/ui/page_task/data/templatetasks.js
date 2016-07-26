import TemplateTask from './templatetask.js';

module.exports = class TemplateTasks {
	constructor(){
		this.arr = new Array();
	}

	init(param){
		param.map((function(task){
			var t = new TemplateTask();
			t.init(task);
			t.setParent(this);
			this.arr.push(t);
		}).bind(this))
	}

	getArr(){
		return this.arr;
	}

	find(templateId){
		return this.arr.find(function(task){
			return task.template.type == templateId; //todo: drag template task(mule mrd) to timeline. templateid : int and string .
		})
	}
	addTask(task){
		this.arr.unshift(task);
	}
}