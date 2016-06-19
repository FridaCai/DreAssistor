import BaseTask from './basetask.js';

module.exports = class Task extends BaseTask{
	constructor(){
	    super(); 

	    this.templateTask = undefined;
	}

	init(param){
		super.init(param);

		this.templateTask = param.templateTask;
	}
}