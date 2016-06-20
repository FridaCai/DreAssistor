import BaseTask from './basetask.js';

module.exports = class Task extends BaseTask{
	constructor(){
	    super(); 
	    this.templateTaskId = undefined;
	}

	init(param){
		super.init(param);
		this.templateTaskId = param.templateTaskId;
	}

	setTemplateTaskId(id){
		this.templateTaskId = id;
	}

	dump(){
		var obj = super.dump();
		return $.extend(obj, {
			templateTaskId: this.templateTaskId
		});
	}
}