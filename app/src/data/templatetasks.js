import TemplateTask from './templatetask.js';

module.exports = class TemplateTasks extends Array{
	constructor(){
		super();
	}

	init(param){
		param.map((function(task){
			this.push(TemplateTask.create(task));
		}).bind(this))
	}

	findById(templateId){
		return this.find(function(task){
			return task.template.type == templateId; //todo: drag template task(mule mrd) to timeline. templateid : int and string .
		})
	}
	addTask(task){
		this.unshift(task);
	}
	
}