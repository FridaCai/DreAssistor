import Util from 'Util';

module.exports = class TemplateTask{
	static create(param){
		var templateTask = new TemplateTask();
		templateTask.init(param);
		return templateTask;
	}
	constructor(){
		
	}
	init(param){
		this.id = param.id || Util.generateUUID();
		this.label = param.label;
		this.markColor = param.markColor || 6076508;
		this.template = param.template;
	}
}